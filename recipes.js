import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";
import Recipe from "../models/Recipe.js";

const router = express.Router();

// ---------------- CONFIG ---------------- //

const CLOUDINARY_CONFIGURED =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (CLOUDINARY_CONFIGURED) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage for local files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = file.fieldname === 'video' ? 'videos' : 'images';
    const fullPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  }
});

// ---------------- ROUTES ---------------- //

// Add new recipe
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    let imageUrl = "";
    let videoUrl = "";

    if (CLOUDINARY_CONFIGURED && req.files) {
      // Handle Cloudinary uploads
      if (req.files.image) {
        const imageUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "recipes/images" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          fs.createReadStream(req.files.image[0].path).pipe(stream);
        });
        imageUrl = imageUploadResult.secure_url;
        // Clean up local file
        fs.unlinkSync(req.files.image[0].path);
      }

      if (req.files.video) {
        const videoUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { 
              folder: "recipes/videos",
              resource_type: "video",
              chunk_size: 6000000
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          fs.createReadStream(req.files.video[0].path).pipe(stream);
        });
        videoUrl = videoUploadResult.secure_url;
        // Clean up local file
        fs.unlinkSync(req.files.video[0].path);
      }
    } else {
      // Handle local file storage
      if (req.files && req.files.image) {
        imageUrl = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files && req.files.video) {
        videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
      }
    }

    const recipe = await Recipe.create({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients
        ? req.body.ingredients.split(",").map((i) => i.trim())
        : [],
      steps: req.body.steps
        ? req.body.steps.split("\n").map((s) => s.trim())
        : [],
      imageUrl,
      videoUrl,
      author: req.user?.id || null, // optional
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error("Error adding recipe:", err);
    res.status(500).json({ message: "Error adding recipe", error: err.message });
  }
});

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Error fetching recipes", error: err.message });
  }
});

// Get single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ message: "Error fetching recipe", error: err.message });
  }
});

// Update recipe
router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    let imageUrl;
    let videoUrl;

    if (CLOUDINARY_CONFIGURED && req.files) {
      // Handle image upload
      if (req.files.image) {
        const imageUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "recipes/images" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(req.files.image[0].buffer);
        });
        imageUrl = imageUploadResult.secure_url;
      }

      // Handle video upload
      if (req.files.video) {
        const videoUploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { 
              folder: "recipes/videos",
              resource_type: "video",
              chunk_size: 6000000
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(req.files.video[0].buffer);
        });
        videoUrl = videoUploadResult.secure_url;
      }
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients
          ? req.body.ingredients.split(",").map((i) => i.trim())
          : [],
        steps: req.body.steps
          ? req.body.steps.split("\n").map((s) => s.trim())
          : [],
        ...(imageUrl && { imageUrl }),
        ...(videoUrl && { videoUrl }),
      },
      { new: true }
    );

    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ message: "Error updating recipe", error: err.message });
  }
});

// Delete recipe
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ message: "Error deleting recipe", error: err.message });
  }
});

export default router;
