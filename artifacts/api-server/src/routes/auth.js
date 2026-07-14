import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, eq, count } from "@workspace/db";
import { signToken } from "../lib/jwt.js";
import { requireAuth } from "../middlewares/auth.js";
const router = Router();
router.get("/needs-setup", async (_req, res) => {
    try {
        const result = await db.select({ count: count() }).from(usersTable);
        const userCount = Number(result[0]?.count ?? 0);
        res.json({ needsSetup: userCount === 0 });
    }
    catch (err) {
        res.status(500).json({ error: "server_error", message: "Failed to check setup status" });
    }
});
router.post("/setup", async (req, res) => {
    try {
        const result = await db.select({ count: count() }).from(usersTable);
        const userCount = Number(result[0]?.count ?? 0);
        if (userCount > 0) {
            res.status(409).json({ error: "conflict", message: "Admin already exists" });
            return;
        }
        const { username, password, email } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "bad_request", message: "Username and password are required" });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const [user] = await db.insert(usersTable).values({
            username,
            passwordHash,
            email: email || null,
        }).returning();
        const token = signToken({ userId: user.id, username: user.username });
        res.status(201).json({
            token,
            user: { id: user.id, username: user.username, email: user.email },
        });
    }
    catch (err) {
        res.status(500).json({ error: "server_error", message: "Failed to create admin" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "bad_request", message: "Username and password are required" });
            return;
        }
        const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username));
        if (!user) {
            res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
            return;
        }
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
            return;
        }
        const token = signToken({ userId: user.id, username: user.username });
        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email },
        });
    }
    catch (err) {
        res.status(500).json({ error: "server_error", message: "Login failed" });
    }
});
router.get("/me", requireAuth, async (req, res) => {
    try {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.userId));
        if (!user) {
            res.status(401).json({ error: "unauthorized", message: "User not found" });
            return;
        }
        res.json({ id: user.id, username: user.username, email: user.email });
    }
    catch {
        res.status(500).json({ error: "server_error", message: "Failed to get user" });
    }
});
export default router;
