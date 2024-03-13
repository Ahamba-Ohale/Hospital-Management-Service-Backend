const mongoose = require("mongoose");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken")

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
    enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Other'],
    default: 'Other',
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other'],
    default: 'Other',
  },  
  name: {
    type: String,
    required: [true, 'Full Name is required'],
    minlength: [3, 'Full Name must be at least 3 characters long'],
    maxlength: [50, 'Full Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z' -]+$/, 'Full Name can only contain letters, spaces, hyphens, or apostrophes.'],
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
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
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
      message: (props) => `Password must meet the specified criteria: ${passwordSchema.validate(props.value, { list: true }).join(', ')}`
    }
  },  
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        // Access the document being validated using the context option
        return value === this.password;
      },
      message: 'Passwords do not match',
      // Pass the document to the validator using the context option
      context: 'confirmPassword', 
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
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
  return token;
};

// Custom validation method
userSchema.methods.customValidate = async function () {
  try {
    await this.validate();
    return null; // No errors
  } catch (error) {
    const errors = {};

    // Handle general errors
    if (error.name !== 'ValidationError') {
      console.error('Error during custom validation:', error);
      errors['_general'] = 'An unexpected error occurred during validation';
      return { errors };
    }    

    // Handle validation errors
    error.errors && Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return { errors };
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;