//bookcontroller
import Book from "../models/Book.js";
// 📚 List all approved books (for public/frontend)
export const listBooks = async (req, res) => {
  try {
    const books = await Book.find({ status: "approved" });
    res.json(books);
  } catch (error) {
    console.error("Error in listBooks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📚 Get books by category (case-insensitive)
export const listBooksByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const books = await Book.find({
      category: { $regex: new RegExp(`^${category}$`, "i") }
    });

    res.json(books);
  } catch (error) {
    console.error("Error in listBooksByCategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📖 Get single book
// Get all books for logged-in author
// 📖 Get single book
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews.user", "name email");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("❌ Error fetching book:", error);
    res.status(500).json({ message: "Server error fetching book" });
  }
};


// ✍️ Create book (author/publisher/admin)
export const createBook = async (req, res) => {
  try {
    const { title, description, author, category, price, coverUrl } = req.body;

    const book = new Book({
      title,
      description,
      author,
      category,
      price,
      coverUrl,
      createdBy: req.user._id,
      status: "approved", // default when submitted
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update book (author/publisher/admin)
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // only the creator or admin/publisher can update
    if (book.createdBy.toString() !== req.user._id.toString() && !["admin", "publisher"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to update this book" });
    }

    const { title, description, author, category, price, coverUrl } = req.body;

    book.title = title || book.title;
    book.description = description || book.description;
    book.author = author || book.author;
    book.category = category || book.category;
    book.price = price || book.price;
    book.coverUrl = coverUrl || book.coverUrl;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete book (author/publisher/admin)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user._id.toString() && !["admin", "publisher"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized to delete this book" });
    }

    await book.deleteOne();
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Approve book (publisher/admin)
export const approveBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.status = "approved";
    await book.save();
    res.json({ message: "Book approved", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Reject book (publisher/admin)
export const rejectBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    book.status = "rejected";
    await book.save();
    res.json({ message: "Book rejected", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 Admin: list all books
export const adminListBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author", "name email");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};


// 👑 Admin: update any book
export const adminUpdateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 Admin: delete any book
export const adminDeleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    await book.deleteOne();
    res.json({ message: "Book deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Add a review
// @route POST /api/books/:id/reviews
export const addReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Book already reviewed" });
    }

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    book.reviews.push(review);
    await book.save();
    res.status(201).json({ message: "Review added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a review
// @route DELETE /api/books/:id/reviews/:reviewId
export const deleteReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const review = book.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only review owner or admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

book.reviews.pull(review._id);   
 await book.save();
    res.json({ message: "Review removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 