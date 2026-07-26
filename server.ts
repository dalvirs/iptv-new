import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS middleware for API endpoints
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Stream / Request Proxy to handle CORS for IPTV streams & M3U files
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      res.status(400).json({ error: "Missing 'url' query parameter" });
      return;
    }

    try {
      const userAgent = (req.query.userAgent as string) || "IPTVSmarters/1.0.0 (Linux; Android 10)";
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": userAgent,
          "Accept": "*/*",
        },
      });

      if (!response.ok && response.status !== 206) {
        res.status(response.status).send(`Failed to fetch stream: ${response.statusText}`);
        return;
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      res.setHeader("Content-Type", contentType);

      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }

      const acceptRanges = response.headers.get("accept-ranges");
      if (acceptRanges) {
        res.setHeader("Accept-Ranges", acceptRanges);
      }

      const contentRange = response.headers.get("content-range");
      if (contentRange) {
        res.setHeader("Content-Range", contentRange);
      }

      if (response.body) {
        // @ts-ignore
        const reader = response.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        await pump();
      } else {
        const arrayBuffer = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuffer));
      }
    } catch (err: any) {
      console.error("Proxy error:", err?.message || err);
      res.status(500).json({ error: "Failed to proxy stream", details: err?.message });
    }
  });

  // Xtream Codes API Proxy route
  app.get("/api/xtream/proxy", async (req, res) => {
    const host = req.query.host as string;
    const username = req.query.username as string;
    const password = req.query.password as string;
    const action = req.query.action as string;
    const category_id = req.query.category_id as string;
    const stream_id = req.query.stream_id as string;
    const series_id = req.query.series_id as string;

    if (!host) {
      res.status(400).json({ error: "Host parameters required" });
      return;
    }

    let cleanHost = host.trim();
    if (!cleanHost.startsWith("http://") && !cleanHost.startsWith("https://")) {
      cleanHost = "http://" + cleanHost;
    }
    cleanHost = cleanHost.replace(/\/+$/, "");

    let url = `${cleanHost}/player_api.php?username=${encodeURIComponent(username || "")}&password=${encodeURIComponent(password || "")}`;
    if (action) url += `&action=${encodeURIComponent(action)}`;
    if (category_id) url += `&category_id=${encodeURIComponent(category_id)}`;
    if (stream_id) url += `&stream_id=${encodeURIComponent(stream_id)}`;
    if (series_id) url += `&series_id=${encodeURIComponent(series_id)}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "IPTVSmartersPro/3.1.5 (Android/11)",
          "Accept": "application/json",
        },
      });

      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to query Xtream API", details: err?.message });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IB Pro IPTV Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
