import { verifyToken } from "../lib/jwt.js";
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "unauthorized", message: "No token provided" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: "unauthorized", message: "Invalid or expired token" });
    }
}
