import { Router } from "express";
import geminiController from "../controllers/geminiController.js";

const router = Router();

router.post("/roadmap", geminiController.generateRoadmap);

export default router;
