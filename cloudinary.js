const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload single image to Cloudinary
const uploadImage = async (imageBuffer, folder = 'recipe-app') => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto:good' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(imageBuffer);
    });
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Upload multiple images
const uploadImages = async (images, folder = 'recipe-app/recipes') => {
  try {
    const uploadPromises = images.map(async (image) => {
      // Handle both buffer and base64 string
      let imageBuffer;
      if (typeof image === 'string') {
        // Remove data:image/...;base64, prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        imageBuffer = image;
      }
      
      return await uploadImage(imageBuffer, folder);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Upload profile image with specific transformations
const uploadProfileImage = async (imageBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'recipe-app/profiles',
          resource_type: 'image',
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' },
            { quality: 'auto:good' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(imageBuffer);
    });
  } catch (error) {
    throw new Error(`Profile image upload failed: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Delete image error:', error);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

// Delete multiple images
const deleteImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('Delete multiple images error:', error);
    throw new Error(`Multiple image deletion failed: ${error.message}`);
  }
};

// Generate optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    quality: 'auto:good',
    format: 'auto',
    ...options
  };

  return cloudinary.url(publicId, defaultOptions);
};

// Generate responsive image URLs
const getResponsiveImageUrls = (publicId) => {
  const sizes = [
    { name: 'thumbnail', width: 150, height: 150 },
    { name: 'small', width: 300, height: 200 },
    { name: 'medium', width: 600, height: 400 },
    { name: 'large', width: 1200, height: 800 }
  ];

  return sizes.reduce((urls, size) => {
    urls[size.name] = cloudinary.url(publicId, {
      width: size.width,
      height: size.height,
      crop: 'fill',
      quality: 'auto:good',
      format: 'auto'
    });
    return urls;
  }, {});
};

// Middleware for handling single file upload
const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Middleware for handling multiple file uploads
const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

// Middleware for handling mixed file uploads
const uploadFields = (fields) => {
  return upload.fields(fields);
};

// Validate image before upload
const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  return true;
};

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = parts.slice(-3, -1).join('/');
    return `${folder}/${publicId}`;
  } catch (error) {
    console.error('Extract public ID error:', error);
    return null;
  }
};

// Get image metadata
const getImageMetadata = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      createdAt: result.created_at,
      url: result.secure_url
    };
  } catch (error) {
    console.error('Get image metadata error:', error);
    throw new Error(`Failed to get image metadata: ${error.message}`);
  }
};

// Create image archive (for backup)
const createImageArchive = async (publicIds, archiveName) => {
  try {
    const result = await cloudinary.utils.archive_params({
      type: 'upload',
      target_format: 'zip',
      public_ids: publicIds,
      resource_type: 'image'
    });

    return result;
  } catch (error) {
    console.error('Create image archive error:', error);
    throw new Error(`Failed to create image archive: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadImages,
  uploadProfileImage,
  deleteImage,
  deleteImages,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  validateImage,
  extractPublicId,
  getImageMetadata,
  createImageArchive
};