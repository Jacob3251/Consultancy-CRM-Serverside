import { Router } from "express";
import ClientController from "../controllers/ClientController.js";

const router = Router();

router.get("/", ClientController.index); //Get all the clients
router.post("/", ClientController.create); // Create a new client
router.get("/:id", ClientController.show); //Get individual client by id
router.get("/:id/transactions", ClientController.transactions); //Get individual client by id
router.put("/:id/update", ClientController.update); //Update individual client by id
router.delete("/:id/delete", ClientController.delete); //Delete individual client by id

export default router;
