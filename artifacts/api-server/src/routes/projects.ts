import { Router, type IRouter, Request, Response } from "express";
import { db, projectsTable, projectMediaTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

async function getProjectWithMedia(id: number) {
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!project) return null;
  const media = await db.select().from(projectMediaTable).where(eq(projectMediaTable.projectId, id));
  return { ...project, media };
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await db.select().from(projectsTable).orderBy(projectsTable.createdAt);
    const withMedia = await Promise.all(projects.map(p => getProjectWithMedia(p.id)));
    res.json(withMedia.filter(Boolean));
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch projects" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid ID" });
      return;
    }
    const project = await getProjectWithMedia(id);
    if (!project) {
      res.status(404).json({ error: "not_found", message: "Project not found" });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch project" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, longDescription, category, year, technologies, githubUrl, demoUrl, featured, color, icon, coverImage } = req.body;

    if (!title || !description || !category || !year) {
      res.status(400).json({ error: "bad_request", message: "Missing required fields" });
      return;
    }

    const [project] = await db.insert(projectsTable).values({
      title,
      description,
      longDescription: longDescription || null,
      category,
      year: Number(year),
      technologies: Array.isArray(technologies) ? technologies : [],
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      featured: Boolean(featured),
      color: color || "#00d4ff",
      icon: icon || null,
      coverImage: coverImage || null,
    }).returning();

    res.status(201).json({ ...project, media: [] });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to create project" });
  }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid ID" });
      return;
    }

    const { title, description, longDescription, category, year, technologies, githubUrl, demoUrl, featured, color, icon, coverImage } = req.body;

    const [project] = await db.update(projectsTable).set({
      title,
      description,
      longDescription: longDescription || null,
      category,
      year: Number(year),
      technologies: Array.isArray(technologies) ? technologies : [],
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      featured: Boolean(featured),
      color: color || "#00d4ff",
      icon: icon || null,
      coverImage: coverImage || null,
    }).where(eq(projectsTable.id, id)).returning();

    if (!project) {
      res.status(404).json({ error: "not_found", message: "Project not found" });
      return;
    }

    const updated = await getProjectWithMedia(id);
    res.json(updated);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to update project" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid ID" });
      return;
    }
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    res.json({ success: true, message: "Project deleted" });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to delete project" });
  }
});

router.post("/:id/media", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid ID" });
      return;
    }

    const { type, url, caption, order } = req.body;

    if (!type || !url) {
      res.status(400).json({ error: "bad_request", message: "type and url are required" });
      return;
    }

    const [media] = await db.insert(projectMediaTable).values({
      projectId: id,
      type,
      url,
      caption: caption || null,
      order: order ?? 0,
    }).returning();

    res.status(201).json(media);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to add media" });
  }
});

export default router;
