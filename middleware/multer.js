import multer from 'multer';

export default multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024, // Batas ukuran file 2 MB
  },
  // fileFilter: (req, file, cb) => {
  //   if (
  //     file.mimetype === 'image/png' ||
  //     file.mimetype === 'image/jpeg' ||
  //     file.mimetype === 'image/jpg'
  //   ) {
  //     cb(null, true); // Terima file
  //   } else {
  //     cb(
  //       new Error(
  //         'Hanya file dengan ekstensi PNG, JPG, atau JPEG yang diperbolehkan'
  //       )
  //     );
  //   }
  // },
});
