import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import projectsRouter from "./projects.js";
import profileRouter from "./profile.js";
import skillsRouter from "./skills.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/projects", projectsRouter);
router.use("/profile", profileRouter);
router.use("/skills", skillsRouter);

export default router;
