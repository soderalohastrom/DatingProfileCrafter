import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const router = Router();

// Define base directories
const uploadsDir = path.join(process.cwd(), "uploads");
const profileImagesDir = path.join(uploadsDir, "profile-images");
const backgroundsDir = path.join(uploadsDir, "backgrounds");
const thumbnailsDir = path.join(uploadsDir, "thumbnails");
const assetsDir = path.join(process.cwd(), "client", "src", "assets");

// Ensure upload directories exist
[uploadsDir, profileImagesDir, backgroundsDir, thumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const targetDir = profileImagesDir;
    cb(null, targetDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  }
});

// Create thumbnail for an image file
async function createThumbnail(filePath: string, filename: string) {
  const thumbnailPath = path.join(thumbnailsDir, filename);
  await sharp(filePath)
    .resize(200, 200, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(thumbnailPath);
  return `/uploads/thumbnails/${filename}`;
}

// Get list of images from a directory
function getImagesFromDirectory(directory: string, urlPrefix: string) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory does not exist: ${directory}`);
    return [];
  }

  const files = fs.readdirSync(directory);
  console.log(`Files found in ${directory}:`, files);

  return files
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(filename => ({
      url: `${urlPrefix}/${filename}`,
      thumbnailUrl: `${urlPrefix}/${filename}`, // For assets, use the same URL for now
      type: directory.includes('backgrounds') ? 'background' : 'profile'
    }));
}

// Handle file upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/profile-images/${req.file.filename}`;
    const thumbnailUrl = await createThumbnail(req.file.path, req.file.filename);

    res.json({ 
      url: fileUrl,
      thumbnailUrl: thumbnailUrl,
      type: 'profile'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

// Get available images
router.get("/", (req, res) => {
  try {
    const directory = req.query.directory as string;
    console.log('Requested directory:', directory);

    let images = [];
    let targetDir: string;
    let urlPrefix: string;

    if (directory.startsWith('client/src/assets/')) {
      // Handle assets directory (sample images)
      targetDir = path.join(process.cwd(), directory);
      // For assets, use the src path for URLs
      urlPrefix = `/src/${directory.replace('client/src/', '')}`;
      console.log('Looking in assets directory:', targetDir);
      console.log('URL prefix:', urlPrefix);
    } else {
      // Handle uploaded images
      targetDir = profileImagesDir;
      urlPrefix = '/uploads/profile-images';
    }

    images = getImagesFromDirectory(targetDir, urlPrefix);
    console.log('Found images:', images);

    res.json(images);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: "Failed to list images" });
  }
});

export default router;