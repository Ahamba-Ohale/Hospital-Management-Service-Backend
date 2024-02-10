// models/ProfilePicture.js
class ProfilePicture {
    constructor(userId, imageData, contentType) {
      this.userId = userId;
      this.imageData = imageData;
      this.contentType = contentType;
    }
  }
  
  module.exports = ProfilePicture;