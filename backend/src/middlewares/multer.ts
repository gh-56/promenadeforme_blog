import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     return cb(null, 'uploads/');
  //   },
  //   filename: (req, file, cb) => {
  //     return cb(null, `${Date.now()}-${file.originalname}`);
  //   },
  // }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
