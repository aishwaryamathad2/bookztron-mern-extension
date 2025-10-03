// backend/controllers/authorController.js
import Book from "../models/Book.js";
import User from "../models/User.js";

// Get logged-in author's profile
export const getMyProfile = async (req, res) => {
  try {
    const author = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "books",
        select: "title coverUrl price category createdAt",
      });

    if (!author || author.role !== "author") {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(author);
  } catch (err) {
    console.error("❌ Error in getMyProfile:", err);
    res.status(500).json({ error: "Server error while fetching author profile" });
  }
};

// Get author profile by id (admin / public usage protected by route)
export const getAuthorProfile = async (req, res) => {
  try {
    const author = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "books",
        select: "title coverUrl price category createdAt",
      });

    if (!author || author.role !== "author") {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json(author);
  } catch (err) {
    console.error("❌ Error in getAuthorProfile:", err);
    res.status(500).json({ error: "Server error while fetching author profile" });
  }
};

// Create a book (author creates book; book.createdBy set)
export const createBook = async (req, res) => {
  try {
    // required fields: title, price (others optional)
    const { title, description = "", price = 0, category = "General", coverUrl = "" } = req.body;

    if (!title) return res.status(400).json({ error: "Title is required" });

    // Use author's name as book.author (Book model's author is a string)
    const book = new Book({
      title,
      author: req.user.name || "Unknown Author",
      description,
      price,
      category,
      coverUrl,
      createdBy: req.user._id,
    });

    const saved = await book.save();

    // push into user's books array
    await User.findByIdAndUpdate(req.user._id, { $push: { books: saved._id } });

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error in createBook:", err);
    res.status(500).json({ error: "Failed to create book", details: err.message });
  }
};

// Get all books by logged-in author
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ createdBy: req.user._id });
    res.json(books);
  } catch (err) {
    console.error("❌ Error in getMyBooks:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Update a book (only creator or admin)
export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Only creator or admin can update
    if (book.createdBy?.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this book" });
    }

    Object.assign(book, updates); // apply updates
    const updated = await book.save();

    res.json(updated);
  } catch (err) {
    console.error("❌ Error in updateBook:", err);
    res.status(500).json({ error: "Failed to update book" });
  }
};

// Delete a book (only creator or admin)
export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.createdBy?.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this book" });
    }

    await Book.findByIdAndDelete(bookId);

    // Remove reference from user's books array
    await User.findByIdAndUpdate(book.createdBy, { $pull: { books: bookId } });

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteBook:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};
