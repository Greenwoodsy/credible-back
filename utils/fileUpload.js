// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary"); // Import Cloudinary config

// // Configure Cloudinary Storage for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "kyc_documents", // Folder in Cloudinary
//     format: async (req, file) => "png", // Convert all uploads to PNG
//     public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
//   },
// });

// // File filter to allow only images and PDFs
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpeg|jpg|png|gif|webp|bmp|heic|pdf/;
//   const extname = allowedFileTypes.test(file.originalname.toLowerCase());
//   const mimetype = allowedFileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpeg, .jpg, .png, .gif, .webp, .bmp, .heic, and .pdf files are allowed"));
//   }
// };

// // Set up multer middleware
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
//   fileFilter,
// });

// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // Import Cloudinary config

// ✅ Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("Uploading File:", file.originalname, "| MIME Type:", file.mimetype);

    return {
      folder: "kyc_documents", // Folder in Cloudinary
      resource_type: "auto", // Handles images + PDFs automatically
      public_id: `${file.fieldname}-${Date.now()}`, // Unique file name
    };
  },
});

// ✅ File filter for accepted file types
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  console.log("File Type Check:", file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Please upload JPG, PNG, WEBP, HEIC, HEIF, or PDF files."
      )
    );
  }
};

// ✅ Set up multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter,
});

module.exports = upload;
