import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AuthorBooksSection = ({ authorId }) => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    coverUrl: "",
    publisherId: "",
    publisherEmail: "",
  });

  const [publisherId, setPublisherId] = useState("");
  const [publisherEmail, setPublisherEmail] = useState("");

  // ✅ Fetch author's books
  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/books/author/${authorId}`
      );
      setBooks(res.data);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      toast.error("Failed to load your books");
    }
  };

  // ✅ Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to add a book!");
      return;
    }

    try {
      const bookData = {
        ...newBook,
        author: authorId,
        publisherId: publisherId || null,
        publisherEmail: publisherEmail || null,
      };

      const res = await axios.post("http://localhost:5000/api/books", bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("✅ Book added successfully!");

      // Reset form
      setNewBook({
        title: "",
        description: "",
        price: "",
        category: "",
        coverUrl: "",
        publisherId: "",
        publisherEmail: "",
      });
      setPublisherId("");
      setPublisherEmail("");

      fetchBooks(); // Refresh book list
    } catch (error) {
      console.error("❌ Error adding book:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add book. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📚 Your Books</h2>

      {/* Book List */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="border rounded-xl p-4 shadow-sm">
              <img
                src={book.coverUrl || "/books/default.png"}
                alt={book.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-bold">{book.title}</h3>
              <p className="text-gray-600">{book.category}</p>
              <p className="text-sm mt-1">₹{book.price}</p>
            </div>
          ))
        ) : (
          <p>No books yet. Add one below 👇</p>
        )}
      </div>

      {/* Add Book Form */}
      <h3 className="text-xl font-semibold mb-3">➕ Add New Book</h3>
      <form
        onSubmit={handleAddBook}
        className="space-y-3 bg-gray-50 p-4 rounded-xl shadow-md"
      >
        <input
          type="text"
          name="title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          placeholder="Book Title"
          className="border p-2 w-full rounded"
          required
        />

        <textarea
          name="description"
          value={newBook.description}
          onChange={(e) =>
            setNewBook({ ...newBook, description: e.target.value })
          }
          placeholder="Description"
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="number"
          name="price"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
          placeholder="Price"
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          name="category"
          value={newBook.category}
          onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
          placeholder="Category"
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="text"
          name="coverUrl"
          value={newBook.coverUrl}
          onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}
          placeholder="Cover Image URL"
          className="border p-2 w-full rounded"
        />

        {/* ✅ Optional Publisher Fields */}
        <div className="pt-2 border-t mt-4">
          <h4 className="text-gray-700 font-medium mb-2">
            Optional Publisher Info
          </h4>

          <input
            type="text"
            placeholder="Publisher ID (optional)"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />

          <input
            type="email"
            placeholder="Publisher Email (optional)"
            value={publisherEmail}
            onChange={(e) => setPublisherEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-3"
        >
          Add Book
        </button>
      </form>

      <Toaster position="top-center" />
    </div>
  );
};

export default AuthorBooksSection;
