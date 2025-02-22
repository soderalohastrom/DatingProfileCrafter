import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const router = Router();

// Ensure upload directories exist
const uploadsDir = path.join(process.cwd(), "uploads");
const profileImagesDir = path.join(uploadsDir, "profile-images");
const backgroundsDir = path.join(uploadsDir, "backgrounds");
const thumbnailsDir = path.join(uploadsDir, "thumbnails");

[uploadsDir, profileImagesDir, backgroundsDir, thumbnailsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine upload directory based on image type
    const imageType = req.body.type || 'profile';
    const targetDir = imageType === 'background' ? backgroundsDir : profileImagesDir;
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

// Create thumbnail for uploaded image
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

// Handle single file upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    const imageType = req.body.type || 'profile';
    const baseUrl = imageType === 'background' ? '/uploads/backgrounds' : '/uploads/profile-images';
    const fileUrl = `${baseUrl}/${req.file.filename}`;
    
    // Create thumbnail
    const thumbnailUrl = await createThumbnail(req.file.path, req.file.filename);
    
    res.json({ 
      url: fileUrl,
      thumbnailUrl: thumbnailUrl,
      type: imageType
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

// Get available images
router.get("/", (req, res) => {
  try {
    const type = req.query.type as string || 'profile';
    const targetDir = type === 'background' ? backgroundsDir : profileImagesDir;
    
    const files = fs.readdirSync(targetDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(filename => {
        const baseUrl = type === 'background' ? '/uploads/backgrounds' : '/uploads/profile-images';
        return {
          url: `${baseUrl}/${filename}`,
          thumbnailUrl: `/uploads/thumbnails/${filename}`,
          type
        };
      });
      
    res.json(files);
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: "Failed to list images" });
  }
});

export default router;
