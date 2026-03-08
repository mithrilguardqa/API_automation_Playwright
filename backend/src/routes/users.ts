import { Router } from "express";
import * as usersController from "../controllers/users.js";

const router = Router();

router.get("/", usersController.list);
router.get("/:id", usersController.getById);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);

export default router;
