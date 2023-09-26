const mongoose = require("mongoose");
const storySchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    // required: true,
  },
  upvotes: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userStories", // Reference the User model
  },
  // media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UploadedMedia', autopopulate: true }],
  upvotedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userStoris",
    },
  ],
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});
// collection and userSchema
const storyModel = mongoose.model("stories", storySchema);
module.exports = storyModel;
