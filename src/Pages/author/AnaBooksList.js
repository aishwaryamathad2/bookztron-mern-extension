//anabookslist
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./AuthorDashboard.css";

const AnaBooksList = () => {
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

  // Ana Huang's author details
  const authorName = "Ana Huang";
  const authorId = "690d6b22a71246caadbf88b7";

  // ✅ Fetch Ana's books
  const fetchBooks = async () => {
    try {
      const res = await axios.get(
  `http://localhost:5000/api/books/author/${authorId}`
);

      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    }
  };

  // ✅ Add new book
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined") {
  console.log("❌ Invalid token, user must login again");
  localStorage.removeItem("token");
}


      const res = await axios.post(
        "http://localhost:5000/api/books",
        {
          ...newBook,
          author: authorId,
          authorName,
          publisherId: newBook.publisherId || undefined,
          publisherEmail: newBook.publisherEmail || undefined,
        },
        {
          headers: {
Authorization: token ? `Bearer ${token}` : "",
           "Content-Type": "application/json",
          },
        }
      );

      toast.success("✅ Book added successfully!");
      console.log("Book added:", res.data);

      setNewBook({
        title: "",
        description: "",
        price: "",
        category: "",
        coverUrl: "",
        publisherId: "",
        publisherEmail: "",
      });

      fetchBooks(); // refresh list
    } catch (error) {
      console.error(
        "❌ Error adding book:",
        error.response?.data || error.message
      );
      toast.error("Failed to add book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="section-container">
      <h2>📚 My Books</h2>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img
              src={book.coverUrl || "/books/default.png"}
              alt={book.title}
              className="book-cover"
            />
<h3>
  {book.title} by <span>{book.authorName || "Ana Huang"}</span>
</h3>

<span style={{ fontSize: "14px", color: "#666" }}>
  Author ID: {book.author}
</span>


            <p>₹{book.price}</p>
          </div>
        ))}
      </div>

      <h3>Add New Book</h3>
      <form onSubmit={handleSubmit} className="add-book-form">
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newBook.description}
          onChange={(e) =>
            setNewBook({ ...newBook, description: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={newBook.category}
          onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={newBook.coverUrl}
          onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}
        />

        {/* ✅ Optional Publisher Info */}
        <h4>Optional Publisher Info</h4>
        <input
          type="text"
          placeholder="Publisher ID (optional)"
          value={newBook.publisherId}
          onChange={(e) =>
            setNewBook({ ...newBook, publisherId: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Publisher Email (optional)"
          value={newBook.publisherEmail}
          onChange={(e) =>
            setNewBook({ ...newBook, publisherEmail: e.target.value })
          }
        />

        <button type="submit">Add Book</button>
      </form>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default AnaBooksList;