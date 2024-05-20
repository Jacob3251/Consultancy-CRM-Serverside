import { Router } from "express";
import {
  authenticate,
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../controllers/UserController.js";
import { hasher } from "../utils/helper.js";

const router = Router();

router.get("/", fetchUsers);
router.post("/", createUser);
router.post("/autheticate", authenticate);
// router.post("/", async (req, res) => {
//   console.log(await hasher(req.body.password));
// });
// router.get("/", fetchUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
