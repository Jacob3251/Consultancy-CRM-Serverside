import { Router } from "express";
import {
  authenticate,
  createUser,
  deleteUser,
  fetchUsers,
  getUser,
  updateUser,
  updateUserInfo,
} from "../controllers/UserController.js";
import { hasher } from "../utils/helper.js";
import { uploadSingle } from "../middleware/fileMiddleware.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";

const router = Router();

router.get("/", fetchUsers);
router.post("/", createUser);
router.post("/autheticate", authenticate);
// router.post("/", async (req, res) => {
//   console.log(await hasher(req.body.password));
// });
// router.get("/", fetchUsers);
router.get(
  "/:id",
  // verifyPermission(permissionNames.MODIFY_OWN_INFO.id),
  getUser
);
router.put("/:id", uploadSingle.single("file"), updateUserInfo);
router.delete("/:id", deleteUser);
// for updating other users
router.put("/:id/update", uploadSingle.single("file"), updateUser);

export default router;
