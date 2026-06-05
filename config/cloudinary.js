const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'jobboard/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

// Resume storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'jobboard/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadResume = multer({ storage: resumeStorage });

module.exports = { cloudinary, uploadAvatar, uploadResume };