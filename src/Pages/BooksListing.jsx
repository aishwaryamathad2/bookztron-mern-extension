import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BooksListing = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/books");
      setBooks(data.books); // 👈 adjust if backend returns differently
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) return <p>Loading books...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Books</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {books.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg shadow p-2 flex flex-col items-center bg-white"
          >
            <img
              src={book.coverUrl}
              alt={book.bookName}
              className="h-24 w-16 object-cover mb-2 rounded"
            />
            <h3 className="font-medium text-xs text-center">{book.bookName}</h3>
            <p className="text-gray-500 text-xs">{book.author}</p>
            <p className="mt-1 text-sm font-bold">
              ₹{book.discountedPrice || book.originalPrice || book.price}
            </p>

            {/* 👇 Link to product page */}
            <Link
              to={`/product/${book._id}`}
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded mt-2"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksListing;
