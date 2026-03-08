import { Router } from "express";
import * as recordsController from "../controllers/records.js";

const router = Router();

router.get("/", recordsController.list);
router.get("/:id", recordsController.getById);
router.post("/", recordsController.create);
router.put("/:id", recordsController.update);
router.delete("/:id", recordsController.remove);

export default router;
