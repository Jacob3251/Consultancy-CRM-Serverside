import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { clientSchema } from "../validation/ClientValidation.js";
import { response } from "express";
import { removeFile } from "../utils/helper.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";
// console.log(prisma);
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
      const file = req.file;
      console.log(body);
      const validator = vine.compile(clientSchema);
      const payload = await validator.validate(body);
      console.log("payload =====================", payload);
      const found = await prisma.client.findUnique({
        where: {
          clientEmail: payload.clientEmail,
        },
      });
      if (found) {
        console.log("");
        return res.status(400).json({
          message: "Client already exists",
        });
      }
      if (file) {
        const resultFile = await uploadFile(file.path);
        const modifiedPayload = {
          ...payload,
          client_image: JSON.stringify(resultFile),
        };
        const newClient = await prisma.client.create({
          data: modifiedPayload,
        });

        const parsedClientImage = JSON.parse(newClient.client_image);
        return res.status(200).json({
          message: "Client Created",
          data: { ...newClient, client_image: parsedClientImage },
        });
      }

      if (!file) {
        const newClient = await prisma.client.create({
          data: payload,
        });

        console.log(newClient);
        res.status(200).json({
          message: "Client Created",
          data: newClient,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
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
      const attachmentData = await prisma.attachments.findMany({
        where: {
          ownerId: clientId,
          type: "CLIENT",
        },
      });
      if (clientData) {
        const { client_image } = clientData;
        const parsedClientImage = JSON.parse(client_image);
        res.status(200).json({
          message: "Client Found",
          data: {
            ...clientData,
            client_image: parsedClientImage,
            attachments: attachmentData,
          },
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
      console.log(clientId);
      const file = req.file;
      const body = req.body;
      const validator = vine.compile(clientSchema);
      console.log("body+++++++++++++", body);
      console.log("file+++++++++++++", file);

      const payload = await validator.validate(body);
      console.log("payload+++++++++++++", payload);

      const found = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });
      const parsedImageLink = JSON.parse(found.client_image);
      // console.log(parsedImageLink);

      if (found) {
        if (file) {
          try {
            deleteFile(parsedImageLink);
          } catch (deleteError) {
            console.error("Error deleting file:", deleteError);
            return res.status(500).json({
              message: "Error deleting file",
              error: deleteError.message,
            });
          }
          const resultFile = await uploadFile(file.path);
          const modifiedPayload = {
            ...payload,
            client_image: JSON.stringify(resultFile),
          };
          const updatedClient = await prisma.client.update({
            data: modifiedPayload,
            where: {
              id: clientId,
            },
          });
          if (updatedClient) {
            return res.status(200).json({
              message: "Client Updated",
              data: { ...updatedClient, client_image: resultFile },
            });
          } else {
            try {
              deleteFile(resultFile);
            } catch (deleteError) {
              console.error("Error deleting file:", deleteError);
              return res.status(500).json({
                message: "Error deleting file",
                error: deleteError.message,
              });
            }
          }
        }
        await prisma.client
          .update({
            data: payload,
            where: {
              id: clientId,
            },
          })
          .then((data) => {
            return res.status(200).json({
              status: 200,
              message: `Lead id of ${clientId} named ${data.name} updated successfully`,
            });
          });
      } else {
        return res.status(400).json({
          message: "Client does not exist",
        });
      }
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async delete(req, res) {
    const clientId = req.params.id;
    try {
      const attachments = await prisma.attachments.findMany({
        where: {
          type: "CLIENT",
          ownerId: clientId,
        },
      });
      for (let i = 0; i < attachments.length; i++) {
        try {
          deleteFile(JSON.parse(attachments[i].fileLink));
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
      }
      const clientData = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });
      if (clientData && clientData.client_image !== null) {
        try {
          deleteFile(JSON.parse(clientData.client_image));
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
      }
      const clientProgress = await prisma.progress.findMany({
        where: {
          clientId: clientId,
        },
      });
      if (clientProgress.length !== 0) {
        await prisma.progress.deleteMany({
          where: {
            clientId: clientId,
          },
        });
      }
      await prisma.attachments.deleteMany({
        where: {
          type: "CLIENT",
          ownerId: clientId,
        },
      });
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
