const nodemailer = require('nodemailer');

// Email templates
const emailTemplates = {
  emailVerification: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Recipe App, ${context.name}!</h2>
      <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${context.verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${context.verificationUrl}">${context.verificationUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        If you didn't create an account with Recipe App, please ignore this email.
      </p>
    </div>
  `,

  passwordReset: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${context.name},</p>
      <p>You requested a password reset for your Recipe App account. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${context.resetUrl}" 
           style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${context.resetUrl}">${context.resetUrl}</a></p>
      <p><strong>This link will expire in 10 minutes for security reasons.</strong></p>
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  `,

  welcomeEmail: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Recipe App! 🍳</h2>
      <p>Hi ${context.name},</p>
      <p>Your email has been verified successfully! Welcome to our community of food lovers.</p>
      <h3>Here's what you can do now:</h3>
      <ul>
        <li>🔍 Discover amazing recipes from our community</li>
        <li>📝 Share your own favorite recipes</li>
        <li>⭐ Rate and review recipes</li>
        <li>👥 Follow other food enthusiasts</li>
        <li>💾 Save recipes to your favorites</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Start Exploring
        </a>
      </div>
      <p>Happy cooking!</p>
      <p>The Recipe App Team</p>
    </div>
  `,

  newFollower: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Follower! 👥</h2>
      <p>Hi ${context.userName},</p>
      <p><strong>${context.followerName}</strong> is now following you on Recipe App!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/profile/${context.followerId}" 
           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Profile
        </a>
      </div>
      <p>Check out their recipes and maybe follow them back!</p>
    </div>
  `,

  recipeRated: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Recipe Got Rated! ⭐</h2>
      <p>Hi ${context.authorName},</p>
      <p><strong>${context.raterName}</strong> gave your recipe "${context.recipeName}" a ${context.rating}-star rating!</p>
      ${context.comment ? `<div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
        <p style="margin: 0; font-style: italic;">"${context.comment}"</p>
      </div>` : ''}
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/recipe/${context.recipeId}" 
           style="background-color: #ffc107; color: #212529; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Recipe
        </a>
      </div>
      <p>Keep sharing your amazing recipes!</p>
    </div>
  `,

  recipeComment: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Comment on Your Recipe! 💬</h2>
      <p>Hi ${context.authorName},</p>
      <p><strong>${context.commenterName}</strong> commented on your recipe "${context.recipeName}":</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
        <p style="margin: 0; font-style: italic;">"${context.comment}"</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/recipe/${context.recipeId}#comments" 
           style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Comment
        </a>
      </div>
      <p>Join the conversation and reply!</p>
    </div>
  `,

  weeklyDigest: (context) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Weekly Recipe Digest 📊</h2>
      <p>Hi ${context.userName},</p>
      <p>Here's what happened with your recipes this week:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">📈 Your Stats</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;">👀 <strong>${context.totalViews}</strong> recipe views</li>
          <li style="margin: 10px 0;">⭐ <strong>${context.totalRatings}</strong> new ratings</li>
          <li style="margin: 10px 0;">💬 <strong>${context.totalComments}</strong> new comments</li>
          <li style="margin: 10px 0;">👥 <strong>${context.newFollowers}</strong> new followers</li>
        </ul>
      </div>

      ${context.topRecipe ? `
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0;">🏆 Top Performing Recipe</h3>
        <p><strong>"${context.topRecipe.name}"</strong> got ${context.topRecipe.views} views this week!</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Dashboard
        </a>
      </div>
      
      <p>Keep up the great work!</p>
      <p>The Recipe App Team</p>
    </div>
  `
};

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email sending function
const sendEmail = async (templateName, recipientEmail, context, subject) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[templateName];
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const mailOptions = {
      from: `"Recipe App" <${process.env.FROM_EMAIL}>`,
      to: recipientEmail,
      subject: subject || getDefaultSubject(templateName),
      html: template(context),
      text: stripHtml(template(context)) // Plain text fallback
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail}:`, result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Helper function to get default subjects
const getDefaultSubject = (templateName) => {
  const subjects = {
    emailVerification: 'Please verify your email address',
    passwordReset: 'Reset your password - Recipe App',
    welcomeEmail: 'Welcome to Recipe App! 🍳',
    newFollower: 'You have a new follower!',
    recipeRated: 'Your recipe got rated! ⭐',
    recipeComment: 'New comment on your recipe 💬',
    weeklyDigest: 'Your weekly recipe digest 📊'
  };
  return subjects[templateName] || 'Notification from Recipe App';
};

// Helper function to strip HTML for plain text version
const stripHtml = (html) => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
};

// Convenience functions for specific email types
const emailService = {
  sendVerificationEmail: (email, name, verificationUrl) => {
    return sendEmail('emailVerification', email, { name, verificationUrl });
  },

  sendPasswordReset: (email, name, resetUrl) => {
    return sendEmail('passwordReset', email, { name, resetUrl });
  },

  sendWelcomeEmail: (email, name) => {
    return sendEmail('welcomeEmail', email, { name });
  },

  sendNewFollowerNotification: (email, userName, followerName, followerId) => {
    return sendEmail('newFollower', email, { userName, followerName, followerId });
  },

  sendRecipeRatedNotification: (email, authorName, raterName, recipeName, rating, recipeId, comment = null) => {
    return sendEmail('recipeRated', email, { 
      authorName, raterName, recipeName, rating, recipeId, comment 
    });
  },

  sendRecipeCommentNotification: (email, authorName, commenterName, recipeName, comment, recipeId) => {
    return sendEmail('recipeComment', email, { 
      authorName, commenterName, recipeName, comment, recipeId 
    });
  },

  sendWeeklyDigest: (email, userName, stats) => {
    return sendEmail('weeklyDigest', email, { 
      userName, 
      totalViews: stats.totalViews,
      totalRatings: stats.totalRatings,
      totalComments: stats.totalComments,
      newFollowers: stats.newFollowers,
      topRecipe: stats.topRecipe
    });
  }
};

module.exports = {
  emailTemplates,
  sendEmail,
  emailService,
  createTransporter
};