import { Router } from "express";
import * as resetController from "../controllers/reset.js";

const router = Router();

router.post("/", resetController.reset);

export default router;
