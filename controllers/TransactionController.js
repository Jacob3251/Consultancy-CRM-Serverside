import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { transactionSchema } from "../validation/TransactionValidation.js";
import { messages } from "@vinejs/vine/defaults";

class TransactionController {
  static async index(req, res) {
    try {
      const data = await prisma.transaction.findMany({});

      if (data) {
        res.status(200).json({
          message:
            data.length === 0 ? "No Transaction yet" : "All Transactions",
          data: data,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });
    }
  }

  static async create(req, res) {
    try {
      const body = req.body;
      console.log(body);
      const data = { ...body, amount: parseInt(body.amount) };
      const validation = vine.compile(transactionSchema);

      const payload = await validation.validate(data);
      await prisma.transaction
        .create({
          data: payload,
        })
        .then((data) =>
          res.status(201).json({
            message: "Transaction Added",
            data: data,
          })
        );
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const transactionId = req.params.id;

      const data = await prisma.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });

      if (data) {
        res.status(200).json({
          message: "Single Transaction Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Transaction Request",
        error: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const transactionId = req.params.id;
      const body = req.body;
      const validator = vine.compile(transactionSchema);
      const payload = await validator.validate(body);
      const data = await prisma.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });

      if (data) {
        await prisma.transaction
          .update({
            data: payload,
            where: {
              id: transactionId,
            },
          })
          .then((data) =>
            res.status(200).json({
              message: "Data Updated",
            })
          );
      }
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const transactionId = req.params.id;

      await prisma.transaction
        .delete({
          where: {
            id: transactionId,
          },
        })
        .then((data) =>
          res.status(200).json({
            message: `Transaction of id: ${transactionId} deleted successfully`,
          })
        );
    } catch (error) {
      res.status(500).json({
        message: "Bad Request for Transaction Deletion",
      });
    }
  }
}

export default TransactionController;
