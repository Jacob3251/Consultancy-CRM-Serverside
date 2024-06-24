import { Router } from "express";
import RoleController from "../controllers/RoleController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
const router = Router();

router.get(
  "/",
  // verifyPermission(permissionNames.VIEW_ROLES.id),
  RoleController.index
);
router.post(
  "/",
  // verifyPermission(permissionNames.CREATE_ROLE.id),
  RoleController.create
);
router.get(
  "/:id",
  // verifyPermission(permissionNames.VIEW_ROLES.id),
  RoleController.show
);
router.put(
  "/:id",
  // verifyPermission(permissionNames.CREATE_ROLE.id),
  RoleController.update
);
router.delete(
  "/:id",
  // verifyPermission(permissionNames.CREATE_ROLE.id),
  RoleController.delete
);

export default router;
