import { Router } from "express";
import * as tracksController from "../controllers/tracks.js";

const router = Router();

router.get("/", tracksController.list);
router.get("/:id", tracksController.getById);
router.post("/", tracksController.create);
router.put("/:id", tracksController.update);
router.delete("/:id", tracksController.remove);

export default router;
