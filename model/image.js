const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var gridStore = require("mongoose-gridstore");

const ImageSchema = new Schema({
  caption: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
  fileId: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
});
ImageSchema.plugin(gridStore);
const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
