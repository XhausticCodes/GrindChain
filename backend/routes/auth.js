import { Router } from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";
const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/check", authController.checkAuth);

router.get("/me", auth, authController.getMe);
router.patch("/me", auth, authController.updateMe);
router.post("/clear-group", auth, authController.clearCurrentGroup);

export default router;
