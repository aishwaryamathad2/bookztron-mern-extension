//book.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "General" },

    coverUrl: { type: String },

    ratings: { type: Number, min: 0, max: 5, default: 0 },
    status: {
      type: String,
      default: "approved", // "pending" | "approved" | "rejected"
    },

    // 🔑 Track creator (who added book)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ⭐ Reviews
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

// ✅ Ensure coverUrl always has https://
bookSchema.pre("save", function (next) {
  if (this.coverUrl && !this.coverUrl.startsWith("http")) {
    this.coverUrl = `https://${this.coverUrl}`;
  }
  next();
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
