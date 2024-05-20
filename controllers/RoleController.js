import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { roleSchema } from "../validation/RoleValidation.js";
import { messages } from "@vinejs/vine/defaults";

class RoleController {
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
      const allRoles = await prisma.role.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
      const totalRoles = await prisma.lead.count();
      const totalPages = Math.ceil(totalRoles / limit);
      return res.json({
        status: 200,
        data: allRoles,
        metadata: {
          totalPages,
          currentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  static async show(req, res) {
    try {
      const roleId = req.params.id;
      const roleData = await prisma.role.findUnique({
        where: {
          id: Number(roleId),
        },
      });

      if (roleData) {
        res.json({
          status: 200,
          message: "Individual role",
          data: roleData,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Request",
      });
    }
  }
  static async create(req, res) {
    try {
      // const { title } = req.body;
      const body = req.body;
      const validator = vine.compile(roleSchema);
      const payload = await validator.validate(body);

      const newRole = await prisma.role.create({
        data: payload,
      });
      res.json({
        status: 200,
        message: "Role Created",
        data: newRole,
      });
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
      const roleId = req.params.id;
      const body = req.body;
      const validator = vine.compile(roleSchema);

      const payload = await validator.validate(body);
      await prisma.role.update({
        data: payload,
        where: {
          id: Number(roleId),
        },
      });
      res.json({
        status: 201,
        messages: `Role id of ${roleId} updated.`,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const roleId = req.params.id;
      await prisma.role.delete({
        where: {
          id: Number(roleId),
        },
      });
      res.json({
        status: 200,
        message: `Role of id: ${roleId} deleted successfully`,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
}

export default RoleController;
