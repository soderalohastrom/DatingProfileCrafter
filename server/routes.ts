import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertThemeSchema, insertSlideElementSchema } from "@shared/schema";
import { ZodError } from "zod";
import uploadRouter from "./routes/upload";

export async function registerRoutes(app: Express) {
  // Profile routes
  app.get("/api/profiles", async (_req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(parseInt(req.params.id));
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });

  // Theme management routes
  app.get("/api/admin/themes", async (_req, res) => {
    try {
      const themes = await storage.getAllThemes();
      res.json(themes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch themes" });
    }
  });

  app.post("/api/admin/themes", async (req, res) => {
    try {
      const themeData = insertThemeSchema.parse(req.body);
      const theme = await storage.createTheme(themeData);
      res.status(201).json(theme);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid theme data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create theme" });
      }
    }
  });

  app.patch("/api/admin/themes/:id", async (req, res) => {
    try {
      const updates = insertThemeSchema.partial().parse(req.body);
      const theme = await storage.updateTheme(parseInt(req.params.id), updates);
      res.json(theme);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid theme data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update theme" });
      }
    }
  });

  app.delete("/api/admin/themes/:id", async (req, res) => {
    try {
      await storage.deleteTheme(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete theme" });
    }
  });

  // Slide element routes
  app.get("/api/admin/themes/:themeId/slides/:slideNumber/elements", async (req, res) => {
    try {
      const elements = await storage.getSlideElements(
        parseInt(req.params.themeId),
        parseInt(req.params.slideNumber)
      );
      res.json(elements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch slide elements" });
    }
  });

  app.post("/api/admin/themes/:themeId/slides/:slideNumber/elements", async (req, res) => {
    try {
      const elementData = insertSlideElementSchema.parse({
        ...req.body,
        themeId: parseInt(req.params.themeId),
        slideNumber: parseInt(req.params.slideNumber),
      });
      const element = await storage.createSlideElement(elementData);
      res.status(201).json(element);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid element data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create slide element" });
      }
    }
  });

  app.patch("/api/admin/themes/:themeId/slides/:slideNumber/elements/:id", async (req, res) => {
    try {
      const updates = insertSlideElementSchema.partial().parse(req.body);
      const element = await storage.updateSlideElement(parseInt(req.params.id), updates);
      res.json(element);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid element data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update slide element" });
      }
    }
  });

  app.delete("/api/admin/themes/:themeId/slides/:slideNumber/elements/:id", async (req, res) => {
    try {
      await storage.deleteSlideElement(parseInt(req.params.id));
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete slide element" });
    }
  });

  // File upload route
  app.use("/api/upload", uploadRouter);

  return createServer(app);
}