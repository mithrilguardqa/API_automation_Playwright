import { Router } from "express";
import * as carsController from "../controllers/cars.js";

const router = Router();

router.get("/", carsController.list);
router.get("/:id", carsController.getById);
router.post("/", carsController.create);
router.put("/:id", carsController.update);
router.delete("/:id", carsController.remove);

export default router;
