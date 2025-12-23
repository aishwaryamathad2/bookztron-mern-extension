//src/AdminDashboard/ManageBooks
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AdminDashboard/admin.css";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editBookId, setEditBookId] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const fetchBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get("http://localhost:5000/api/books/admin/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(data)) {
      setBooks(data);
    } else if (Array.isArray(data.books)) {
      setBooks(data.books);
    } else {
      console.warn("Unexpected response format:", data);
      setBooks([]);
    }

    setLoading(false);
  } catch (err) {
    console.error("❌ Fetch Books Error:", err.response?.data || err.message);
    setError("Failed to load books");
    setBooks([]);
    setLoading(false);
  }
};



  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/books/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  const updateBookPrice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/books/admin/${id}`,
        { price: newPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditBookId(null);
      setNewPrice("");
      fetchBooks();
    } catch (err) {
      alert("Failed to update price");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-section">
      <h2 className="admin-title">📚 Manage Books</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="book-cover"
                />
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                {editBookId === book._id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="admin-input"
                    />
                    <button
                      onClick={() => updateBookPrice(book._id)}
                      className="btn-save"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditBookId(null)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>₹{book.price}</>
                )}
              </td>
              <td>{book.status || "Approved"}</td>
              <td>
                <button
                  onClick={() => {
                    setEditBookId(book._id);
                    setNewPrice(book.price);
                  }}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBook(book._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooks;
