import { Router } from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import ensureDatabaseConnection from "../middleware/dbConnection.js";
const router = Router();

// Auth routes that require database connection
router.post("/signup", ensureDatabaseConnection, authController.signup);
router.post("/login", ensureDatabaseConnection, authController.login);
router.post("/logout", authController.logout);
router.get("/check", authController.checkAuth);

router.get("/me", auth, authController.getMe);
router.patch("/me", auth, authController.updateMe);
router.post("/clear-group", auth, authController.clearCurrentGroup);

export default router;
