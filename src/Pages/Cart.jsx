import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartProvider";
import { HorizontalProductCard } from "../Components/HorizontalCard/HorizontalProductCard.jsx";
import "./Cart.css";

const Cart = () => {
  const { userCart, dispatchUserCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch cart from backend
  useEffect(() => {
    async function fetchCart() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatchUserCart({
          type: "UPDATE_USER_CART",
          payload: res.data.cart || [],
        });
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [dispatchUserCart]);

  // ✅ Remove from cart
  const handleRemoveFromCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🟡 Cart token:", token);  
      await axios.delete(`http://localhost:5000/api/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local context immediately
      dispatchUserCart({
        type: "REMOVE_FROM_CART",
        payload: bookId,
      });
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart-page">
      <h2>{userCart.length} items in Cart</h2>

      {error && <p className="error">{error}</p>}

      <div className="cart-grid">
        {userCart.length > 0 ? (
          userCart.map((item) =>
            item.book ? (
              <div key={item.book._id} className="cart-item">
                <HorizontalProductCard
                  productDetails={{
                    _id: item.book._id,
                    bookName: item.book.title,
                    author: item.book.author,
                    price: item.book.price,
                    imgSrc:
                      item.book.coverUrl ||
                      "https://via.placeholder.com/100x150",
                    quantity: item.quantity,
                  }}
                  hideActions={true}
                />

                <div className="cart-actions">
                  <button
                    onClick={() => handleRemoveFromCart(item.book._id)}
                    className="remove-btn"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ) : null
          )
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate("/")} className="shop-btn">
              Browse Books
            </button>
          </div>
        )}
      </div>

      {userCart.length > 0 && (
        <div className="checkout-container">
          <button
            onClick={() => navigate("/checkout")}
            className="checkout-btn"
          >
            🛍️ Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
