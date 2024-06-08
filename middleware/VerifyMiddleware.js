import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken";
export const verifyPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Extract the token from the headers
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).json({ message: "Invalid Request" });
      }
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Invalid Request" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Fetch the user and role details from the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "Invalid Request" });
      }

      // Fetch the role permissions
      const role = await prisma.role.findFirst({
        where: { title: user.role },
      });

      if (!role) {
        return res.status(404).json({ message: "Invalid Request" });
      }

      // Check if the required permission is in the user's role permissions
      if (
        !role.permissions.includes(requiredPermission) ||
        user.verified === false
      ) {
        return res
          .status(403)
          .json({ message: "Permission denied.", errorId: 2 });
      }

      // Permission granted, proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error.",

        errorId: error.message === "jwt expired" && 1,
      });
    }
  };
};
