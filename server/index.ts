import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, "products.json");

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // API Routes
  app.get("/api/products", async (req, res) => {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading products:", error);
      res.status(500).json({ error: "Failed to read products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const newProduct = req.body;
      const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
      const products = JSON.parse(data);

      // Add to both languages or specific? Assuming the payload has structure or we default.
      // For simplicity, let's assume the client sends the full structure or we handle it.
      // Actually, the client should probably send an update for a specific language or both.
      // Let's assume the client sends { language: 'de', product: ... } or just the product and we add to both?
      // Re-reading the data structure: it's { de: [...], en: [...] }.
      // Let's make the API accept { language, product }.

      // Wait, for a real app, we might want to update a specific product ID across languages.
      // But for this simple task, let's just save the whole state or specific updates.
      // Let's try to keep it simple: PUT /api/products/:id updates a product.
      // POST /api/products adds a new one.

      // Let's just write the whole file for now if the client sends the full state? 
      // No, that's dangerous.

      // Let's stick to: GET returns the whole JSON.
      // POST /api/products expects { language, product }.
      // PUT /api/products/:id expects { language, product } (updates that language's entry).

      // Actually, to keep it even simpler for the "Add Product" feature:
      // The user probably wants to add a product and define it for both languages?
      // Let's just expose a way to save the ENTIRE products object. 
      // It's not efficient but it's robust for a simple JSON file.
      // POST /api/save-products body: { de: [...], en: [...] }

      // Let's go with granular if possible, but full save is easier to implement correctly for "edit" without complex merging logic on server.
      // I'll implement /api/products as a full overwrite for now, or maybe just specific operations.
      // Let's try granular:
      // GET /api/products -> returns { de: [...], en: [...] }
      // POST /api/products -> body: { de: Product[], en: Product[] } -> Overwrites everything.
      // This is the easiest way to ensure consistency if the client manages the state.

      const { de, en } = req.body;
      if (!de || !en) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      await fs.writeFile(PRODUCTS_FILE, JSON.stringify({ de, en }, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving products:", error);
      res.status(500).json({ error: "Failed to save products" });
    }
  });

  app.post("/api/login", (req, res) => {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
      res.json({ success: true, token: "fake-jwt-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    // If it's an API call that wasn't matched, don't return HTML
    if (_req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
