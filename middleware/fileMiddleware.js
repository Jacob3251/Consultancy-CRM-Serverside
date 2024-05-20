import multer from "multer";

const basicstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // console.log(file);
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage: basicstorage });
