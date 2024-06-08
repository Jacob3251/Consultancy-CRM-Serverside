import { Router } from "express";
import ClientController from "../controllers/ClientController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
import { uploadSingle } from "../middleware/fileMiddleware.js";

const router = Router();

router.get(
  "/",
  verifyPermission(permissionNames.VIEW_CLIENTS.id),
  ClientController.index
); //Get all the clients
router.post(
  "/",
  verifyPermission(permissionNames.MODIFY_CLIENT.id),
  uploadSingle.single("file"),
  ClientController.create
); // Create a new client
router.get(
  "/:id",
  verifyPermission(permissionNames.VIEW_CLIENTS.id),
  ClientController.show
); //Get individual client by id
router.get(
  "/:id/transactions",
  verifyPermission(permissionNames.VIEW_CLIENTS.id),
  ClientController.transactions
); //Get individual client by id
router.put(
  "/:id/update",
  verifyPermission(permissionNames.MODIFY_CLIENT.id),
  ClientController.update
); //Update individual client by id
router.delete(
  "/:id/delete",
  verifyPermission(permissionNames.MODIFY_CLIENT.id),
  ClientController.delete
); //Delete individual client by id

export default router;
