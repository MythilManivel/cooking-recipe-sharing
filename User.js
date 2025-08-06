const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''
  },
  googleId: {
    type: String,
    sparse: true // Allows multiple null values
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Social features
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Recipe interactions
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  
  // User preferences
  preferences: {
    dietary: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb']
    }],
    cuisines: [String],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy'
    }
  },
  
  // Statistics
  stats: {
    recipesCreated: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ name: 'text', bio: 'text' });

// Virtual for follower count
userSchema.virtual('followerCount').get(function() {
  return this.followers ? this.followers.length : 0;
});

// Virtual for following count
userSchema.virtual('followingCount').get(function() {
  return this.following ? this.following.length : 0;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Method to generate password reset token
userSchema.methods.generateResetPasswordToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Method to check if user is following another user
userSchema.methods.isFollowing = function(userId) {
  return this.following.some(followingId => followingId.toString() === userId.toString());
};

// Method to follow a user
userSchema.methods.follow = async function(userId) {
  if (!this.isFollowing(userId) && userId.toString() !== this._id.toString()) {
    this.following.push(userId);
    await this.save();
    
    // Add this user to the target user's followers
    await mongoose.model('User').findByIdAndUpdate(userId, {
      $addToSet: { followers: this._id }
    });
    
    return true;
  }
  return false;
};

// Method to unfollow a user
userSchema.methods.unfollow = async function(userId) {
  if (this.isFollowing(userId)) {
    this.following.pull(userId);
    await this.save();
    
    // Remove this user from the target user's followers
    await mongoose.model('User').findByIdAndUpdate(userId, {
      $pull: { followers: this._id }
    });
    
    return true;
  }
  return false;
};

// Method to add recipe to favorites
userSchema.methods.addToFavorites = function(recipeId) {
  if (!this.favorites.includes(recipeId)) {
    this.favorites.push(recipeId);
    return this.save();
  }
};

// Method to remove recipe from favorites
userSchema.methods.removeFromFavorites = function(recipeId) {
  this.favorites.pull(recipeId);
  return this.save();
};

// Method to check if recipe is favorited
userSchema.methods.isFavorited = function(recipeId) {
  return this.favorites.some(favId => favId.toString() === recipeId.toString());
};

// Static method to find users by search term
userSchema.statics.search = function(searchTerm, limit = 10) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true
  })
  .select('name email avatar bio stats followerCount')
  .limit(limit)
  .sort({ score: { $meta: 'textScore' } });
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);