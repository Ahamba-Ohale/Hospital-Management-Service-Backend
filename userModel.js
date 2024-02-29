const mongoose = require("mongoose");
const passwordValidator = require("password-validator");

// Create a password schema
const passwordSchema = new passwordValidator();

// Define password rules
passwordSchema
  .is().min(8)  // Minimum length 8
  .has().uppercase()  // Must have uppercase letters
  .has().lowercase()  // Must have lowercase letters
  .has().digits()  // Must have digits
  .has().symbols();  // Must have symbols

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Unknown'],
  },
  firstname: {
    type: String,
    required: [true, 'First Name is required'],
    minlength: [3, 'First Name must be at least 3 characters long'],
    maxlength: [50, 'First Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z' -]+$/, 'First Name can only contain letters, spaces, hyphens, or apostrophes.'],
  },
  lastname: {
    type: String,
    required: [true, 'Last Name is required'],
    minlength: [3, 'Last Name must be at least 3 characters long'],
    maxlength: [50, 'Last Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z' -]+$/, 'Last Name can only contain letters, spaces, hyphens, or apostrophes.'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function (value) {
        // Custom date of birth validation logic (e.g., must be in the past)
        return value < new Date();
      },
      message: 'Invalid date of birth',
    },
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    validate: {
      validator: function (value) {
        // Custom contact validation logic
        return /(?:\+?(\d{1,4}?)[-\s.]?)?((\d{3})|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/.test(value);
      },
      message: 'Contact must be a valid phone number',
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Custom email validation logic
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email format',
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function (value) {
        // Use the password-schema to validate the password
        return passwordSchema.validate(value, { list: true }).length === 0;
      },
      message: 'Password must meet the specified criteria.',
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpiry: {
    type: Date,
  },
}, { timestamps: true });

// Custom validation method
userSchema.methods.customValidate = async function () {
  try {
    await this.validate();
    return null; // No errors
  } catch (error) {
    const errors = {};
    error.errors && Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return { errors };
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;