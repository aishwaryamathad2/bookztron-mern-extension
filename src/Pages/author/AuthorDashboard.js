/* import { useEffect, useState } from "react";
import axiosInstance from "../../Utils/axiosinstance";

export default function AuthorDashboard() {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data } = await axiosInstance.get("/authors/me"); // ✅ now using axiosInstance
        setAuthor(data);
      } catch (err) {
        console.error("❌ Error fetching author:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!author) return <p className="text-red-500">Author not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{author.name}’s Dashboard</h2>
      <p>Email: {author.email}</p>
      <p>Bio: {author.bio}</p>

      {author.books && author.books.length > 0 ? (
        <ul className="list-disc ml-6">
          {author.books.map((book) => (
            <li key={book._id}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p>No books yet.</p>
      )}
    </div>
  );
} */


import { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosinstance";

export default function AuthorDashboard() {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    coverUrl: ""
  });

  // Fetch author profile + books
  const fetchAuthor = async () => {
    try {
      const { data } = await axiosInstance.get("/authors/me");
      setAuthor(data);
    } catch (err) {
      console.error("❌ Error fetching author:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, []);

  // Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/authors/books", newBook);
      setNewBook({ title: "", description: "", price: "", category: "", coverUrl: "" });
      fetchAuthor(); // refresh list
    } catch (err) {
      console.error("❌ Error adding book:", err);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (!author) return <p className="text-red-500">Author not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{author.name}’s Dashboard</h2>
      <p>Email: {author.email}</p>
      <p>Bio: {author.bio}</p>

      {/* Add Book Form */}
      <div className="mt-6 border p-4 rounded bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Add New Book</h3>
        <form onSubmit={handleAddBook} className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            className="border p-2 w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={newBook.price}
            onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newBook.category}
            onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={newBook.coverUrl}
            onChange={(e) => setNewBook({ ...newBook, coverUrl: e.target.value })}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Book
          </button>
        </form>
      </div>

      {/* Author’s Books */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">My Books</h3>
        {author.books && author.books.length > 0 ? (
          <ul className="list-disc ml-6">
            {author.books.map((book) => (
              <li key={book._id}>
                <strong>{book.title}</strong> — ₹{book.price} ({book.category})
              </li>
            ))}
          </ul>
        ) : (
          <p>No books yet.</p>
        )}
      </div>
    </div>
  );
}
