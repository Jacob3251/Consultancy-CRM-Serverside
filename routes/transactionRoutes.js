import { Router } from "express";
import TransactionController from "../controllers/TransactionController.js";

const router = Router();

router.post("/", TransactionController.create);
router.get("/", TransactionController.index);
router.get("/:id", TransactionController.show);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

export default router;
