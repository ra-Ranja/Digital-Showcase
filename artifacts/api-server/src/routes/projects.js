import { Router } from "express";
import { db, projectsTable, projectMediaTable, eq, desc } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";
const router = Router();
async function getProjectWithMedia(id) {
    const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
    if (!project)
        return null;
    const media = await db.select().from(projectMediaTable).where(eq(projectMediaTable.projectId, id));
    return { ...project, media };
}
// GET tous les projets — du plus récent au plus ancien
router.get("/", async (_req, res) => {
    try {
        const projects = await db
            .select()
            .from(projectsTable)
            .orderBy(desc(projectsTable.projectDate), desc(projectsTable.createdAt));
        const withMedia = await Promise.all(projects.map(p => getProjectWithMedia(p.id)));
        res.json(withMedia.filter(Boolean));
    }
    catch {
        res.status(500).json({ error: "server_error", message: "Failed to fetch projects" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "bad_request" });
            return;
        }
        const project = await getProjectWithMedia(id);
        if (!project) {
            res.status(404).json({ error: "not_found" });
            return;
        }
        res.json(project);
    }
    catch {
        res.status(500).json({ error: "server_error" });
    }
});
router.post("/", requireAuth, async (req, res) => {
    try {
        const { title, description, longDescription, category, year, projectDate, technologies, githubUrl, demoUrl, featured, color, icon, coverImageBase64, } = req.body;
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
            projectDate: projectDate || null,
            technologies: Array.isArray(technologies) ? technologies : [],
            githubUrl: githubUrl || null,
            demoUrl: demoUrl || null,
            featured: Boolean(featured),
            color: color || "#00d4ff",
            icon: icon || null,
            coverImage: null,
            coverImageBase64: coverImageBase64 || null,
        }).returning();
        res.status(201).json({ ...project, media: [] });
    }
    catch {
        res.status(500).json({ error: "server_error", message: "Failed to create project" });
    }
});
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "bad_request" });
            return;
        }
        const { title, description, longDescription, category, year, projectDate, technologies, githubUrl, demoUrl, featured, color, icon, coverImageBase64, } = req.body;
        const [project] = await db.update(projectsTable).set({
            title, description,
            longDescription: longDescription || null,
            category,
            year: Number(year),
            projectDate: projectDate || null,
            technologies: Array.isArray(technologies) ? technologies : [],
            githubUrl: githubUrl || null,
            demoUrl: demoUrl || null,
            featured: Boolean(featured),
            color: color || "#00d4ff",
            icon: icon || null,
            coverImageBase64: coverImageBase64 || null,
        }).where(eq(projectsTable.id, id)).returning();
        if (!project) {
            res.status(404).json({ error: "not_found" });
            return;
        }
        res.json(await getProjectWithMedia(id));
    }
    catch {
        res.status(500).json({ error: "server_error" });
    }
});
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "bad_request" });
            return;
        }
        await db.delete(projectsTable).where(eq(projectsTable.id, id));
        res.json({ success: true });
    }
    catch {
        res.status(500).json({ error: "server_error" });
    }
});
router.post("/:id/media", requireAuth, async (req, res) => {
    try {
        const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "bad_request" });
            return;
        }
        const { type, url, caption, order } = req.body;
        if (!type || !url) {
            res.status(400).json({ error: "bad_request" });
            return;
        }
        const [media] = await db.insert(projectMediaTable).values({
            projectId: id, type, url,
            caption: caption || null,
            order: order ?? 0,
        }).returning();
        res.status(201).json(media);
    }
    catch {
        res.status(500).json({ error: "server_error" });
    }
});
export default router;
