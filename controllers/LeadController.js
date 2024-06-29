import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { leadSchema } from "../validation/LeadValidation.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

class LeadController {
  static async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      console.log("page", typeof page, "limit", limit);
      if (page <= 0) {
        page = 1;
      }
      if (limit <= 0 || limit > 100) {
        limit = 10;
      }
      const skip = (page - 1) * limit;
      console.log("skip", skip);

      const allLeads = await prisma.lead.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      });
      const totalLeads = await prisma.lead.count();
      const totalPages = Math.ceil(totalLeads / limit);
      return res.json({
        status: 200,
        data: allLeads,
        metadata: {
          totalPages,
          currentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Error fetching the leads",
        error: error.message,
      });
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      const file = req.file;

      const validator = vine.compile(leadSchema);
      const payload = await validator.validate(body);
      console.log(payload);
      const found = await prisma.lead.findUnique({
        where: {
          clientEmail: payload.clientEmail,
        },
      });
      if (found) {
        return res.status(400).json({
          message: "Lead already exists",
        });
      }
      if (file) {
        const resultFile = await uploadFile(file.path);
        const modifiedPayload = {
          ...payload,
          lead_image: JSON.stringify(resultFile),
        };
        const newLead = await prisma.lead.create({
          data: modifiedPayload,
        });

        const parsedLeadImage = JSON.parse(newLead.lead_image);
        return res.status(200).json({
          message: "Client Created",
          data: { ...newLead, lead_image: parsedLeadImage },
        });
      }

      if (!file) {
        const newLead = await prisma.lead.create({
          data: payload,
        });

        console.log(newLead);
        res.status(200).json({
          message: "Client Created",
          data: newLead,
        });
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages);
        res.json({
          message: error.messages[0].message,
        });
      } else {
        res.status(400).json({
          message: error.message,
        });
      }
    }
  }
  static async update(req, res) {
    try {
      const leadId = req.params.id;
      console.log(leadId);
      const file = req.file;
      const body = req.body;
      const validator = vine.compile(leadSchema);
      console.log("body+++++++++++++", body);
      console.log("file+++++++++++++", file);

      const payload = await validator.validate(body);
      console.log("payload+++++++++++++", payload);

      const found = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      const parsedImageLink = JSON.parse(found.lead_image);
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
            lead_image: JSON.stringify(resultFile),
          };
          const updatedClient = await prisma.lead.update({
            data: modifiedPayload,
            where: {
              id: leadId,
            },
          });
          if (updatedClient) {
            return res.status(200).json({
              message: "Lead Updated",
              data: { ...updatedClient, lead_image: resultFile },
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
        await prisma.lead
          .update({
            data: payload,
            where: {
              id: leadId,
            },
          })
          .then((data) => {
            return res.status(200).json({
              status: 200,
              message: `Lead id of ${leadId} named ${data.name} updated successfully`,
            });
          });
      } else {
        return res.status(400).json({
          message: "Lead does not exist",
        });
      }
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const leadId = req.params.id;
      console.log(leadId);
      const leadData = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      console.log("Found Lead", leadData);
      const attachmentData = await prisma.attachments.findMany({
        where: {
          ownerId: leadId,
          type: "LEADS",
        },
      });
      if (leadData) {
        const { lead_image } = leadData;
        const parsedLeadImage = JSON.parse(lead_image);
        res.status(200).json({
          message: "Lead Found",
          data: {
            ...leadData,
            lead_image: parsedLeadImage,
            attachments: attachmentData,
          },
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Lead request",
        error: error.message,
      });
    }
  }
  static async delete(req, res) {
    const leadId = req.params.id;
    try {
      const attachments = await prisma.attachments.findMany({
        where: {
          type: "LEADS",
          ownerId: leadId,
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
      const leadData = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      if (leadData && leadData.lead_image !== null) {
        try {
          deleteFile(JSON.parse(leadData.lead_image));
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
      }
      const leadProgress = await prisma.progress.findMany({
        where: {
          clientId: leadId,
        },
      });
      if (leadProgress.length !== 0) {
        await prisma.progress.deleteMany({
          where: {
            clientId: leadId,
          },
        });
      }
      await prisma.attachments.deleteMany({
        where: {
          type: "LEADS",
          ownerId: leadId,
        },
      });
      await prisma.lead
        .delete({
          where: {
            id: leadId,
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
}

export default LeadController;
