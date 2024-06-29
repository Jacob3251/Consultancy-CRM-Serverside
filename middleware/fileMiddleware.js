import multer from "multer";

const basicstorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   return cb(null, file.originalname);
  // },
  filename: function (req, file, cb) {
    // console.log(file);
    return cb(null, `aviate ${file.originalname}`);
  },
});

export const uploadSingle = multer({
  storage: basicstorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}); //5mb file limit

export const uploadMultiple = multer({
  storage: basicstorage,
  limits: { fieldSize: 5 * 1024 * 1024 },
}); // 5mb per file
