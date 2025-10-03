//authormodel
import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true, // e.g. "Romance", "Philosophy"
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // reference your Book model
      },
    ],
    role: {
      type: String,
      default: "author",
    },
    profileImage: {
      type: String,
      default: "", // URL of profile pic
    },
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

export default Author;
