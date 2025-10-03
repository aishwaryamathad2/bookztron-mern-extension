import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWishlist, useCart } from "../index";
import { HorizontalProductCard } from "../Components/HorizontalCard/HorizontalProductCard.jsx";

import "./Wishlist.css"; 
const Wishlist = () => {
  const { userWishlist, dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatchUserWishlist({
          type: "UPDATE_USER_WISHLIST",
          payload: res.data.wishlist || [],
        });
      } catch (err) {
        console.error(" Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [dispatchUserWishlist]);

  // ✅ remove from wishlist
  const handleRemoveFromWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/wishlist/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatchUserWishlist({
        type: "UPDATE_USER_WISHLIST",
        payload: userWishlist.filter((book) => book._id !== bookId),
      });
    } catch (err) {
      console.error(" Error removing from wishlist:", err);
    }
  };

  // ✅ add to cart
  const handleAddToCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/users/cart`,
        { bookId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistically update cart
      dispatchUserCart({
        type: "ADD_TO_CART",
        payload: { book: userWishlist.find((b) => b._id === bookId), quantity: 1 },
      });

      // remove from wishlist after adding
      handleRemoveFromWishlist(bookId);
    } catch (err) {
      console.error(" Error adding to cart:", err);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;

  return (
    <div className="wishlist-page">
      <h2>{userWishlist?.length || 0} items in Wishlist</h2>
      <div className="wishlist-grid">
        {userWishlist.length > 0 ? (
          userWishlist.map((book) => (
            <div key={book._id} className="wishlist-item">
                          <HorizontalProductCard
                productDetails={{
                  _id: book._id,
                  bookName: book.title,
                  author: book.author,
                  price: book.price,
                  imgSrc: book.coverUrl || "https://via.placeholder.com/100x150",
                  quantity: book.quantity,
                }}
                hideActions={true}
              />

              <div className="actions">
                <button
                  onClick={() => handleRemoveFromWishlist(book._id)}
                  className="remove-btn"
                >
                   Remove
                </button>
              
              </div>
            </div>
          ))
        ) : (
          <p>Your wishlist is empty </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
