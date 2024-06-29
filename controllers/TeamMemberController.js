import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { teamMemberSchema } from "../validation/TeamMemberValidation.js";
import { removeFile } from "../utils/helper.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

class TeamMemberController {
  static async index(req, res) {
    try {
      const data = await prisma.teammember.findMany({});
      if (data) {
        res.status(200).json({
          message: "All Team Members Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Team Members Not Found",
      });
    }
  }
  static async show(req, res) {
    try {
      const teamMemberId = req.params.id;
      const data = await prisma.teammember.findUnique({
        where: {
          id: teamMemberId,
        },
      });

      if (data) {
        res.status(200).json({
          message: "Team Member Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Team Member Not Found",
        error: error.message,
      });
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      const file = req.file;
      if (!file) {
        throw Error;
      }
      console.log(req.file.path);
      const resultFile = await uploadFile(file.path);
      const teamMemberObj = {
        member_name: body.member_name,
        member_position: body.member_position,
        member_imagelink: resultFile?.url,
      };
      const validator = vine.compile(teamMemberSchema);
      const payload = await validator.validate(teamMemberObj);
      console.log("payload", payload);
      const data = await prisma.teammember.create({
        data: { ...payload, storage_imagelink: JSON.stringify(resultFile) },
      });
      //   console.log("data", data);
      if (data) {
        res.status(201).json({
          message: "Team Member Created",
          data: data,
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
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Team Member Not Added",
        error: error.message,
      });
    }
  }
  // static async update(req,res){}
  static async delete(req, res) {
    try {
      const teammemberId = req.params.id;
      const data = await prisma.teammember.findUnique({
        where: {
          id: teammemberId,
        },
      });
      // console.log(data);
      const parsedData = JSON.parse(data.storage_imagelink);
      try {
        deleteFile(parsedData);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
        return res.status(500).json({
          message: "Error deleting file",
          error: deleteError.message,
        });
      }

      await prisma.teammember
        .delete({
          where: {
            id: teammemberId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Team Member deleted",
          });
        });
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Team Member",
        error: error.message,
      });
    }
  }
}

export default TeamMemberController;
