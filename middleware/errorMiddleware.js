import asyncHandler from "express-async-handler";

export const errorHandler = asyncHandler(async (err, req, res, next) => {
  res.status(200).json({
    hola: "amigo",
  });
});
