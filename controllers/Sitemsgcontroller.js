import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { querySchema } from "../validation/SitemsgqueryValidation.js";

class Sitemsgcontroller {
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
      const allAnsweredMsg = await prisma.sitemsgquery.findMany({
        // skip: skip,
        // take: limit,
        orderBy: {
          created_at: "desc",
        },
        where: {
          status: "Answered",
        },
      });
      const totalMsg = await prisma.sitemsgquery.count();
      const allPending = await prisma.sitemsgquery.findMany({
        where: {
          status: "Pending",
        },
        orderBy: {
          created_at: "desc",
        },
      });
      const totalPages = Math.ceil(totalMsg / limit);
      return res.json({
        status: 200,
        data: [...allPending, ...allAnsweredMsg],
        pending: allPending.length,
        // metadata: {
        //   totalPages,
        //   currentPage: page,
        //   currentLimit: limit,
        //   pending: allPending.length,
        // },
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      console.log(body);
      const validator = vine.compile(querySchema);
      const payload = await validator.validate(body);

      const newMsg = await prisma.sitemsgquery.create({
        data: payload,
      });
      if (newMsg) {
        res.json({
          status: 200,
          message: "Msg Created",
          data: newMsg,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages);
        res.json({
          status: 400,
          message: error.messages[0].message,
        });
      }
    }
  }
  static async update(req, res) {
    try {
      const queryId = req.params.id;
      const body = req.body;
      const validator = vine.compile(querySchema);

      const payload = await validator.validate(body);
      await prisma.sitemsgquery
        .update({
          data: payload,
          where: {
            id: queryId,
          },
        })
        .then((data) => {
          return res.json({
            status: 201,
            messages: `Msg id of ${queryId} updated.`,
            data: data,
          });
        })
        .catch((error) => {
          throw Error;
        });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const queryId = req.params.id;
      const queryData = await prisma.sitemsgquery.findUnique({
        where: {
          id: queryId,
        },
      });

      if (queryData) {
        res.json({
          status: 200,
          message: "Individual msg",
          data: queryData,
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
  static async delete(req, res) {
    try {
      const queryId = req.params.id;
      await prisma.sitemsgquery.delete({
        where: {
          id: queryId,
        },
      });
      res.json({
        status: 200,
        message: `Role of id: ${queryId} deleted successfully`,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
}
export default Sitemsgcontroller;
