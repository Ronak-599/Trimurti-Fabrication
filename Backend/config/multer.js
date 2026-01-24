// Multer configuration with Cloudinary storage (if configured)
// Falls back to local disk storage when Cloudinary env is missing
// Accept only image files and limit file size to 5MB
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const path = require('path');
const fs = require('fs');

const hasCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

let storage;
if (hasCloudinary) {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'gallery_images',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
        }
    });
} else {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    storage = multer.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, uploadsDir);
        },
        filename: function (_req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase();
            const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
            cb(null, `${base}_${Date.now()}${ext}`);
        }
    });
}

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});
module.exports = upload;