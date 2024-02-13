const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Check if the name is at least 3 characters long and contains only letters, spaces, hyphens, or apostrophes.
        const nameRegex = /^[a-zA-Z'-]{3,}/;
        return nameRegex.test(value);
      },
      message: 'Name must be at least 3 characters long and contain only letters, spaces, hyphens, or apostrophes.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function(value) {
        const user = await this.constructor.findOne({ email: value });
        if (user && user.id !== this.id) {
          return false;
        }
        return true;
      },
      message: 'Email already exists',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Check if the password is at least 8 characters long and contains at least one number, one lowercase letter, one uppercase letter and a special character.
        const passwordRegex = /^(?=.[0-9])(?=.[a-z])(?=.[A-Z])(?=.[!@#%^&*()\-_=+[{]}\|;:,<.>]).{8,}/;
        return passwordRegex.test(value);
      },
      message: 'Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter and a special character.',
    },
    set: function(value) {
      // Hash the password before saving it to the database
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(value, salt);
      return hashedPassword;
    },
  },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Check if the contact is a valid phone number
        const phoneRegex = /^(+\d{1,3}\s?)?(((\d{3})|\d{3}))[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return phoneRegex.test(value);
      },
      message: 'Contact must be a valid phone number in the format XXX-XXX-XXXX or XXX.XXX.XXXX or XXX XXX XXXX or +XX XXX XXX XXXX',
    },
  },
  address: {
    type: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
    default: 'https://example.com/default-profile-image.jpg',
    validate: {
      validator: function(value) {
        // Check if the profile image URL is valid
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlRegex.test(value);
      },
      message: 'Profile image URL must be a valid URL',
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;