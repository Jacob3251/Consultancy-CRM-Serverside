import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { permissionSchema } from "../validation/PermissionValidation.js";
import { messages } from "@vinejs/vine/defaults";

class PermissionController {
  //   get all the permission
  static async index(req, res) {
    try {
      const data = await prisma.permissions.findMany();
      if (data) {
        res.status(200).json({
          message: "Permissions Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Permissions Not Found",
      });
    }
  }
  //   show individual permission
  static async show(req, res) {
    try {
      const permissionId = req.params.id;
      const data = await prisma.permissions.findUnique({
        where: {
          id: permissionId,
        },
      });
      if (data) {
        res.status(200).json({
          message: "Permission Register",
          data: data,
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
  //   create permission
  static async create(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(permissionSchema);

      const payload = await validator.validate(body);

      const createdRole = await prisma.permissions.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "Permission Created",
      });
      if (createdRole) {
        console.log("done");
        // res.status(200).json({
        //   message: "Pemission Found",
        //   createdRole: createdRole,
        // });
      } else {
        console.log("notDone");
        throw Error;
      }
    } catch (error) {
      //   if (error instanceof errors.E_VALIDATION_ERROR) {
      //     console.log(error.messages);
      res.json({
        message: error.message,
      });
    }
    // }
  }
  //   updating permission
  static async update(req, res) {
    try {
      const permissionId = req.params.id;
      const body = req.body;
      const validator = vine.compile(permissionSchema);
      const payload = await validator.validate(body);
      const found = await prisma.permissions.findUnique({
        where: {
          id: permissionId,
        },
      });
      if (found) {
        await prisma.permissions
          .update({
            data: payload,
            where: {
              id: permissionId,
            },
          })
          .then((data) => {
            res.status(200).json({
              message: "Permission updated",
              data: data,
            });
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

  //   deleting permission
  static async delete(req, res) {
    try {
      const permissionId = req.params.id;
      await prisma.permissions
        .delete({
          where: {
            id: permissionId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Permission deleted",
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
  }
}

export default PermissionController;
