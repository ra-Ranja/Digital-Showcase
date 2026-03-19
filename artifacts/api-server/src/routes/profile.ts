import { Router, type IRouter, Request, Response } from "express";
import { db, profileTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router: IRouter = Router();

const DEFAULT_PROFILE = {
  name: "Ranja Herimandimby Lioka ANDRIAMIADANA",
  title: "Développeur Junior en Génie Logiciel",
  bio: "Jeune passionné par le Génie Logiciel, ma curiosité et ma polyvalence m'entraînent en quête de défis, transformant chaque obstacle en opportunité. Je souhaite m'impliquer dans des initiatives qui favorisent l'enrichissement de mes connaissances et l'expression de mon potentiel créatif.",
  email: "ranjaandriamiadana667@gmail.com",
  phone: "+261 34 02 198 97",
  location: "Antananarivo, Madagascar",
  github: "https://github.com/ranja-andriamiadana",
  linkedin: null,
  avatarUrl: null,
};

router.get("/", async (_req: Request, res: Response) => {
  try {
    const profiles = await db.select().from(profileTable);

    if (profiles.length === 0) {
      const [profile] = await db.insert(profileTable).values(DEFAULT_PROFILE).returning();
      res.json(profile);
      return;
    }

    res.json(profiles[0]);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to fetch profile" });
  }
});

router.put("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const profiles = await db.select().from(profileTable);

    const { name, title, bio, email, phone, location, github, linkedin, avatarUrl } = req.body;

    if (profiles.length === 0) {
      const [profile] = await db.insert(profileTable).values({
        name: name || DEFAULT_PROFILE.name,
        title: title || DEFAULT_PROFILE.title,
        bio: bio || null,
        email: email || null,
        phone: phone || null,
        location: location || null,
        github: github || null,
        linkedin: linkedin || null,
        avatarUrl: avatarUrl || null,
      }).returning();
      res.json(profile);
      return;
    }

    const [profile] = await db.update(profileTable).set({
      name,
      title,
      bio: bio || null,
      email: email || null,
      phone: phone || null,
      location: location || null,
      github: github || null,
      linkedin: linkedin || null,
      avatarUrl: avatarUrl || null,
    }).returning();

    res.json(profile);
  } catch {
    res.status(500).json({ error: "server_error", message: "Failed to update profile" });
  }
});

// Upload CV
router.post("/cv", requireAuth, upload.single("cv"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "bad_request", message: "No file provided" });
      return;
    }

    const base64 = req.file.buffer.toString("base64"); // 👈 conversion base64

    await db
      .update(usersTable)
      .set({ cvFile: base64, cvFilename: req.file.originalname })
      .where(eq(usersTable.id, req.user!.userId));

    res.json({ message: "CV uploaded successfully", filename: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to upload CV" });
  }
});

// Download CV
router.get("/cv", async (_req: Request, res: Response) => {
  try {
    const [user] = await db
      .select({ cvFile: usersTable.cvFile, cvFilename: usersTable.cvFilename })
      .from(usersTable)
      .limit(1);

    if (!user?.cvFile) {
      res.status(404).json({ error: "not_found", message: "No CV available" });
      return;
    }

    const buffer = Buffer.from(user.cvFile, "base64");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${user.cvFilename ?? "CV.pdf"}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Failed to download CV" });
  }
});

export default router;