import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("public");
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};

// No API key → log emails instead of sending
if (!process.env.RESEND_API_KEY) {
  process.env.RESEND_API_KEY = "dev";
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (String(url).includes("api.resend.com")) {
      const b = JSON.parse(opts.body);
      console.log(
        `\n📧 [mock email] to: ${b.to}  subject: ${b.subject}  attachments: ${(b.attachments || []).length}`,
      );
      return new Response('{"id":"dev"}', { status: 200 });
    }
    return realFetch(url, opts);
  };
}
const { default: book } = await import("./api/book.js");

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");

    if (pathname === "/api/book") {
      let body = "";
      for await (const c of req) body += c;
      try {
        req.body = JSON.parse(body || "{}");
      } catch {
        req.body = {};
      }
      res.status = (c) => {
        res.statusCode = c;
        return res;
      };
      res.json = (o) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(o));
      };
      return book(req, res);
    }

    let file = path.join(ROOT, decodeURIComponent(pathname));
    if (!file.startsWith(ROOT)) {
      res.statusCode = 403;
      return res.end();
    }
    if (pathname === "/") file = path.join(ROOT, "index.html");
    else if (!path.extname(file)) file += ".html";
    if (!fs.existsSync(file)) {
      res.statusCode = 404;
      file = path.join(ROOT, "404.html");
    }

    res.setHeader(
      "Content-Type",
      TYPES[path.extname(file)] || "application/octet-stream",
    );
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () =>
    console.log(`PlumbingBase running at http://localhost:${PORT}`),
  );
