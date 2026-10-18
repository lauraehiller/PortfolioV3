const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  url: { type: String, required: [true, "Url is required"] },
  altText: { type: String, required: [true, "Alt Text is required"] },
  caption: { type: String },
  isFeatured: { type: Boolean, required: true, default: false },
  isArchived: { type: Boolean, default: false, required: true },
  archivedOn: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
