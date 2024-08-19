import { Router } from "express";
import CustomPageController from "../controllers/CustomPageController.js";
import { uploadMultiple } from "../middleware/fileMiddleware.js";

const router = Router();

router.get("/", CustomPageController.index);
// router.get("/pageByCat", CustomPageController.showByCategory);
router.post("/", uploadMultiple.array("files", 3), CustomPageController.create);
router.get("/:id", CustomPageController.show);
router.put(
  "/:id",
  uploadMultiple.array("files", 3),
  CustomPageController.update
);
router.delete("/:id", CustomPageController.delete);

export default router;
