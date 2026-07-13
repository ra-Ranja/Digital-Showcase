import { Router, type IRouter, Request, Response } from "express";
import { eq, db, skillsTable } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";

const router: IRouter = Router();

const DEFAULT_SKILLS = [
  { name: "JavaScript", category: "Langages", level: 85, icon: "JS", color: "#F7DF1E" },
  { name: "TypeScript", category: "Langages", level: 70, icon: "TS", color: "#3178C6" },
  { name: "PHP", category: "Langages", level: 75, icon: "PHP", color: "#8993BE" },
  { name: "Java", category: "Langages", level: 72, icon: "☕", color: "#E76F00" },
  { name: "C#", category: "Langages", level: 70, icon: "C#", color: "#68217A" },
  { name: "C/C++", category: "Langages", level: 65, icon: "C++", color: "#00599C" },
  { name: "Python", category: "Langages", level: 55, icon: "🐍", color: "#3776AB" },
  { name: "ReactJS", category: "Frameworks", level: 82, icon: "⚛️", color: "#61DAFB" },
  { name: "Tailwind CSS", category: "Frameworks", level: 88, icon: "🎨", color: "#06B6D4" },
  { name: "PostgreSQL", category: "Bases de données", level: 75, icon: "🐘", color: "#4169E1" },
  { name: "MySQL", category: "Bases de données", level: 78, icon: "🐬", color: "#4479A1" },
  { name: "SQLite", category: "Bases de données", level: 70, icon: "🗄️", color: "#003B57" },
  { name: "GitHub", category: "Outils", level: 80, icon: "🐙", color: "#333333" },
  { name: "VS Code", category: "Outils", level: 90, icon: "💻", color: "#007ACC" },
];

router.get("/", async (_req: Request, res: Response) => {
  try {
    let skills = await db.select().from(skillsTable);

    if (skills.length === 0) {
      const inserted = await db.insert(skillsTable).values(DEFAULT_SKILLS).returning();
      skills = inserted;
    }

    res.json(skills);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch skills" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, level, icon, color } = req.body;

    if (!name || !category || level === undefined) {
      res.status(400).json({ error: "bad_request", message: "name, category, and level are required" });
      return;
    }

    const [skill] = await db.insert(skillsTable).values({
      name,
      category,
      level: Number(level),
      icon: icon || null,
      color: color || "#00d4ff",
    }).returning();

    res.status(201).json(skill);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to create skill" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid ID" });
      return;
    }
    await db.delete(skillsTable).where(eq(skillsTable.id, id));
    res.json({ success: true, message: "Skill deleted" });
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to delete skill" });
  }
});

export default router;
