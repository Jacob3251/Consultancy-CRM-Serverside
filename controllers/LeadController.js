import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { leadSchema } from "../validation/LeadValidation.js";

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
      const validator = vine.compile(leadSchema);
      const payload = await validator.validate(req.body);
      console.log(payload);
      await prisma.lead
        .create({
          data: payload,
        })
        .then((data) =>
          res.status(200).json({
            message: "Lead Created",
            data: data,
          })
        );
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages);
        res.json({
          message: error.messages[0].message,
        });
      }
    }
  }
  static async update(req, res) {
    try {
      const leadId = req.params.id;
      const body = req.body;
      const validator = vine.compile(leadSchema);
      const payload = await validator.validate(body);
      await prisma.lead
        .update({
          data: payload,
          where: {
            id: leadId,
          },
        })
        .then((data) =>
          res.status(200).json({
            status: 200,
            message: `Lead id of ${leadId} named ${data.name} updated successfully`,
          })
        );
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const leadId = req.params.id;
      await prisma.lead
        .findUnique({
          where: {
            id: leadId,
          },
        })
        .then((data) =>
          res.status(200).json({
            message: "Lead Data Found",
            data: data,
          })
        );
    } catch (error) {
      res.status(400).json({
        message: "Failed to fetch lead data",
      });
    }
  }
  static async delete(req, res) {
    const leadId = req.params.id;
    try {
      await prisma.lead
        .delete({
          where: {
            id: leadId,
          },
        })
        .then((data) =>
          res.status(200).json({
            message: "Lead Deleted",
          })
        );
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Lead",
        errors: error.message,
      });
    }
  }
}

export default LeadController;
