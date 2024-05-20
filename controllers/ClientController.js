import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { clientSchema } from "../validation/ClientValidation.js";

class ClientController {
  static async index(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (page <= 0) {
        page = 1;
      }
      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;
      const allClients = await prisma.client.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      });
      const totalClients = await prisma.client.count();
      const totalPages = Math.ceil(totalClients / limit);
      return res.status(200).json({
        data: allClients,
        metadata: {
          totalPages,
          currentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Can't fetch client data",
        errors: error.message,
      });
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      console.log(body);
      const validator = vine.compile(clientSchema);
      const payload = await validator.validate(body);
      console.log("payload =====================", payload);

      await prisma.client
        .create({
          data: payload,
        })
        .then((data) =>
          res.status(200).json({
            message: "Client Created",
            data: data,
          })
        );
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages);
        res.status(400).json({
          message: error.messages[0].message,
        });
      }
    }
  }
  static async show(req, res) {
    try {
      const clientId = req.params.id;
      const clientData = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });
      if (clientData) {
        res.status(200).json({
          message: "Client Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad client request",
        error: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const clientId = req.params.id;
      const body = req.body;
      const validator = vine.compile(clientSchema);
      const payload = await validator.validate(body);
      await prisma.client
        .update({
          data: payload,
          where: {
            id: clientId,
          },
        })
        .then((data) =>
          res.status(200).json({
            status: 200,
            message: `Lead id of ${clientId} named ${data.name} updated successfully`,
          })
        );
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async delete(req, res) {
    const clientId = req.params.id;
    try {
      await prisma.client
        .delete({
          where: {
            id: clientId,
          },
        })
        .then((data) => {
          res.status(200).json({
            message: "Client Deleted",
          });
        });
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Lead",
        errors: error.message,
      });
    }
  }
  static async transactions(req, res) {
    const clientId = req.params.id;
    const clientData = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });
    try {
      await prisma.transaction
        .findMany({
          where: {
            client_id: clientId,
          },
        })
        .then((data) =>
          res.status(200).json({
            message: `All the records of Mr/Ms. ${clientData.name} client id ${clientId} `,
            data: data,
          })
        );
    } catch (error) {
      res.status(400).json({
        message: `All records of ${clientData.name} error`,
        error: error.message,
      });
    }
  }
}

export default ClientController;
