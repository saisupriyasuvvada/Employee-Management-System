import multer from "multer";
import {
  CloudinaryStorage,
} from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary";

const storage =
  new CloudinaryStorage({
    cloudinary,
    params: async (
      _req,
      file
    ) => ({
      folder: "employee-management-system/profiles",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
      ],

      public_id: `profile-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`,
    }),
  });

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, and WEBP images are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;