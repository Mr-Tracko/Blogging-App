const { Schema, model } = require("mongoose");
const User = require("../models/user");


const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog", 
      required: true, 
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
