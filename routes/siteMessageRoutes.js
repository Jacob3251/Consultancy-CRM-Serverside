import { Router } from "express";
import Sitemsgcontroller from "../controllers/Sitemsgcontroller.js";
const router = Router();

router.get("/", Sitemsgcontroller.index);
router.post("/", Sitemsgcontroller.create);
router.get("/:id", Sitemsgcontroller.show);
router.put("/:id/update", Sitemsgcontroller.update);
router.delete("/:id/delete", Sitemsgcontroller.delete);

export default router;
