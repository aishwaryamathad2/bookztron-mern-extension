// src/Pages/BookDetails/BookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookDetails.css";
import { useWishlist, useCart } from "../../index.js";

const sampleReviews = [
  { user: "Ravi", comment: "Good book!", rating: 4 },
  { user: "Shami", comment: "Nice read.", rating: 5 },
  { user: "Anita", comment: "Very interesting.", rating: 3 },
  { user: "Vikram", comment: "Loved it!", rating: 5 },
  { user: "Priya", comment: "Could be better.", rating: 2 },
  { user: "Kiran", comment: "Amazing story!", rating: 4 },
];

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        const data = res.data.book || res.data;

        // Add fallback rating & reviews
        const randomRating = (Math.random() * 5).toFixed(1);
        const randomReviews = Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          () => sampleReviews[Math.floor(Math.random() * sampleReviews.length)]
        );

        const formattedBook = {
          ...data,
          rating: data.rating || randomRating,
          reviews: data.reviews?.length ? data.reviews : randomReviews,
          coverUrl:
            data.coverUrl ||
            "https://via.placeholder.com/300x400?text=No+Image",
        };

        setBook(formattedBook);
      } catch (err) {
        console.error("Error fetching book details:", err);
      }
    }
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading book details...</p>;

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/users/wishlist/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        dispatchUserWishlist({
          type: "UPDATE_USER_WISHLIST",
          payload: res.data.wishlist,
        });
        alert(`${book.title} added to wishlist!`);
      }
    } catch (err) {
      console.error("Wishlist add error:", err);
      alert("Failed to add to wishlist");
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/users/cart/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        dispatchUserCart({
          type: "UPDATE_USER_CART",
          payload: res.data.cart,
        });
        alert(`${book.title} added to cart!`);
      }
    } catch (err) {
      console.error("Cart add error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="book-details-container">
      <div className="book-details-card">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="book-details-img"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/300x400?text=No+Image")
          }
        />

        <div className="book-details-info">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Price:</strong> ₹{book.price}</p>
          <p><strong>Description:</strong> {book.description}</p>
          <p><strong>Rating:</strong> ⭐ {book.rating}</p>

          <div className="book-actions">
            <button onClick={handleAddToWishlist} className="wishlist-btn">❤️ Add to Wishlist</button>
            <button onClick={handleAddToCart} className="cart-btn">🛒 Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        {book.reviews.length > 0 ? (
          book.reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p><strong>{review.user || "Anonymous"}:</strong> {review.comment}</p>
              <p>⭐ {review.rating}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
