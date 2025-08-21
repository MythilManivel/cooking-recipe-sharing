const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true
  },
  quantity: {
    type: String,
    required: [true, 'Ingredient quantity is required'],
    trim: true
  },
  unit: {
    type: String,
    trim: true,
    enum: ['cups', 'tbsp', 'tsp', 'oz', 'lbs', 'g', 'kg', 'ml', 'l', 'pieces', 'cloves', 'pinch', 'dash', ''],
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [100, 'Ingredient notes cannot exceed 100 characters']
  }
});

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, min: 0 },
  protein: { type: Number, min: 0 }, // in grams
  carbs: { type: Number, min: 0 }, // in grams
  fat: { type: Number, min: 0 }, // in grams
  fiber: { type: Number, min: 0 }, // in grams
  sugar: { type: Number, min: 0 }, // in grams
  sodium: { type: Number, min: 0 } // in mg
});

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [300, 'Comment cannot exceed 300 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Reply cannot exceed 200 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: {
    type: [ingredientSchema],
    validate: {
      validator: function(ingredients) {
        return ingredients && ingredients.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: [true, 'Instruction text is required'],
      trim: true,
      maxlength: [1000, 'Instruction cannot exceed 1000 characters']
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String, 
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  cookingTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [1, 'Cooking time must be at least 1 minute']
  },
  prepTime: {
    type: Number,
    required: [true, 'Prep time is required'],
    min: [1, 'Prep time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Must serve at least 1 person']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Difficulty level is required']
  },
  
  // Categorization
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true,
    enum: ['Italian', 'Chinese', 'Indian', 'Mexican', 'French', 'Japanese', 'Thai', 'Mediterranean', 'American', 'Middle Eastern', 'Other']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Beverage', 'Salad', 'Soup', 'Side Dish']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Dietary information
  dietary: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'high-protein', 'low-sodium']
  }],
  
  nutrition: nutritionSchema,
  
  // Author and social
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipe author is required']
  },
  
  // Ratings and reviews
  ratings: [ratingSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  
  // Social interactions
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  
  // Recipe status and visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  saves: {
    type: Number,
    default: 0
  },
  
  // Additional features
  source: {
    type: String,
    trim: true
  },
  originalRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  variations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  
  // Admin fields
  reportCount: {
    type: Number,
    default: 0
  },
  isReported: {
    type: Boolean,
    default: false
  },
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ author: 1, createdAt: -1 });
recipeSchema.index({ category: 1, cuisine: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ views: -1 });
recipeSchema.index({ isPublic: 1, isPublished: 1 });
recipeSchema.index({ dietary: 1 });

// Virtual for total time
recipeSchema.virtual('totalTime').get(function() {
  return this.prepTime + this.cookingTime;
});

// Virtual for like count
recipeSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
recipeSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for primary image
recipeSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0];
});

// Pre-save middleware to ensure one primary image
recipeSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryCount = this.images.filter(img => img.isPrimary).length;
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    } else if (primaryCount > 1) {
      // Set only the first primary image as primary
      let foundFirst = false;
      this.images.forEach(img => {
        if (img.isPrimary && !foundFirst) {
          foundFirst = true;
        } else if (img.isPrimary) {
          img.isPrimary = false;
        }
      });
    }
  }
  next();
});

// Method to calculate average rating
recipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
    return;
  }
  
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  this.totalRatings = this.ratings.length;
};

// Method to add rating
recipeSchema.methods.addRating = async function(userId, rating, review = '') {
  // Remove existing rating from same user
  this.ratings = this.ratings.filter(r => r.user.toString() !== userId.toString());
  
  // Add new rating
  this.ratings.push({ user: userId, rating, review });
  
  // Recalculate average
  this.calculateAverageRating();
  
  return this.save();
};

// Method to like recipe
recipeSchema.methods.toggleLike = function(userId) {
  const userIndex = this.likes.indexOf(userId);
  
  if (userIndex > -1) {
    this.likes.splice(userIndex, 1);
    return { liked: false, likeCount: this.likes.length };
  } else {
    this.likes.push(userId);
    return { liked: true, likeCount: this.likes.length };
  }
};

// Method to increment views
recipeSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add comment
recipeSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text
  });
  return this.save();
};

// Static method for search
recipeSchema.statics.search = function(searchTerm, filters = {}) {
  const query = { isPublic: true, isPublished: true };
  
  // Text search
  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }
  
  // Apply filters
  if (filters.category) query.category = filters.category;
  if (filters.cuisine) query.cuisine = filters.cuisine;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.dietary && filters.dietary.length > 0) {
    query.dietary = { $in: filters.dietary };
  }
  if (filters.maxTime) {
    query.$expr = { $lte: [{ $add: ['$prepTime', '$cookingTime'] }, filters.maxTime] };
  }
  if (filters.minRating) {
    query.averageRating = { $gte: filters.minRating };
  }
  
  return this.find(query);
};

// Static method to get popular recipes
recipeSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublic: true, isPublished: true })
    .sort({ views: -1, averageRating: -1 })
    .limit(limit)
    .populate('author', 'name avatar');
};

// Static method to get trending recipes
recipeSchema.statics.getTrending = function(limit = 10) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  return this.find({ 
    isPublic: true, 
    isPublished: true,
    createdAt: { $gte: oneWeekAgo }
  })
  .sort({ views: -1, likeCount: -1 })
  .limit(limit)
  .populate('author', 'name avatar');
};

// Static method to get featured recipes
recipeSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    isPublic: true, 
    isPublished: true, 
    isFeatured: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('author', 'name avatar');
};


module.exports = mongoose.model('Recipe', recipeSchema);
