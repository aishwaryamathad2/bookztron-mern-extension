// BooksSection.jsx
import React, { useEffect, useState } from "react";
import {
  getPublisherBooks,
  updatePublisherBookPrice,
  deletePublisherBook,
} from "../../services/publisherService";
import { useAuth } from "../../Context/AuthContext";

export default function BooksSection() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [priceDraft, setPriceDraft] = useState("");

  // ✅ Fetch books when user is loaded
  useEffect(() => {
    if (user) fetchBooks();
  }, [user]);

  // ✅ Fetch all publisher books
  async function fetchBooks() {
    try {
      if (!user || !(user._id || user.id)) {
        console.warn("Publisher not loaded yet");
        return;
      }

      setLoading(true);
      const publisherId = user._id || user.id; // ✅ handles both formats
      const res = await getPublisherBooks(publisherId);

      const list = res.data.books || res.data || [];
      setBooks(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Books fetch error:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Start editing
  function startEdit(book) {
    setEditingId(book._id);
    setPriceDraft(book.price ?? "");
  }

  // ✅ Save updated price
  const saveEdit = async (bookId) => {
    try {
      const { data } = await updatePublisherBookPrice(bookId, priceDraft);

      // ✅ Update state locally (without refetch)
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b._id === bookId ? data.book : b))
      );

      alert("Book price updated successfully!");
      setEditingId(null);
    } catch (error) {
      console.error("Update book error:", error);
      alert("Failed to update book price");
    }
  };

  // ✅ Delete a book
  async function handleDelete(bookId) {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deletePublisherBook(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete book");
    }
  }

  if (loading)
    return (
      <div className="section-card p-6 bg-white rounded shadow">
        Loading books...
      </div>
    );

  return (
    <div className="section-card bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">My Published Books</h2>

      {books.length === 0 ? (
        <p className="text-gray-600">No romance books found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="p-4 border rounded flex flex-col space-y-3 bg-white"
            >
              <img
                src={
                  book.coverUrl ||
                  "https://via.placeholder.com/150x200?text=No+Image"
                }
                alt={book.title}
                className="w-full h-64 object-cover rounded"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150x200?text=No+Image")
                }
              />

              <div className="flex-1">
                <h4 className="font-bold">{book.title}</h4>
<p className="text-sm text-gray-600 mb-1">
  {book.authorName || book.author || "Unknown Author"}
</p>
                <p className="text-sm text-gray-500 mb-2">
                  Category: {book.category || "Romance"}
                </p>

                <div className="flex items-center space-x-2">
                  {editingId === book._id ? (
                    <>
                      <input
                        type="number"
                        value={priceDraft}
                        onChange={(e) => setPriceDraft(e.target.value)}
                        className="border p-1 rounded w-24"
                      />
                      <button
                        className="btn px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => saveEdit(book._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn px-3 py-1 border rounded"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-semibold">
                        ₹{book.price ?? "—"}
                      </div>
                      <button
                        className="btn px-3 py-1 border rounded"
                        onClick={() => startEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn px-3 py-1 border text-red-600 rounded"
                        onClick={() => handleDelete(book._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
