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
  username: {
    type: String,
    required: [true, 'Username is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z' -]+$/, 'Name can only contain letters, spaces, hyphens, or apostrophes.'],
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
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    validate: {
      validator: function (value) {
        // Custom contact validation logic
        // You can use external libraries or implement your logic here
        return /(?:\+?(\d{1,4}?)[-\s.]?)?((\d{3})|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/.test(value);
      },
      message: 'Contact must be a valid phone number',
    }
  },
  address: {
    type: {
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
      street: {
        type: String,
        required: [true, 'Street is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zip: {
        type: String,
        validate: {
          validator: function (value) {
            return /^\d{5}(?:-\d{4})?$/.test(value);
          },
          message: 'Invalid ZIP code format',
        },
      },
    },
    required: [true, 'Address is required and must include country, street, city, and state'],
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
  emergencyContact: {
    type: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
      },
      relationship: {
        type: String,
        required: [true, 'Relationship is required'],
      },
      contact: {
        type: String,
        required: [true, 'Emergency contact number is required'],
        validate: {
          validator: function (value) {
            // Custom emergency contact validation logic
            return /(?:\+?(\d{1,4}?)[-\s.]?)?((\d{3})|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/.test(value);
          },
          message: 'Emergency contact must be a valid phone number',
        },
      },
    },
    required: [true, 'Emergency contact details are required'],
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
  }
}, { timestamps: true });

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