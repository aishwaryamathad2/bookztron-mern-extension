import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WishlistProductCard.css";
import { useToast, useWishlist, useCart } from "../../index";

export default function WishlistProductCard({ productdetails }) {
  const navigate = useNavigate();

  const { userWishlist, dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { showToast } = useToast();

  const {
    _id,
    bookName,
    author,
    originalPrice,
    discountedPrice,
    discountPercent,
    imgSrc,
    imgAlt,
    badgeText,
    outOfStock,
  } = productdetails;

  // ✅ Remove from Wishlist
  async function removeFromWishlist() {
  const token = localStorage.getItem("token");

  if (!token) {
    showToast("warning", "", "Kindly Login");
    navigate("/login");
    return;
  }

  try {
    const res = await axios.delete(
      `http://localhost:5000/api/users/wishlist/${_id}`, // ✅ use "users"
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("👉 Wishlist after delete:", res.data);

   dispatchUserWishlist({
  type: "UPDATE_USER_WISHLIST",
  payload: res.data.wishlist,
});


    showToast("success", "", "Item removed from wishlist");
  } catch (error) {
    console.error("❌ Wishlist error:", error.response?.data || error.message);
    showToast("error", "", "Failed to remove item from wishlist");
  }
}






  // ✅ Add to Cart
  async function addItemToCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("warning", "", "Kindly Login");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/cart/${_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatchUserCart({
        type: "UPDATE_USER_CART",
        payload: res.data.cart,
      });

      showToast("success", "", "Item added to cart");
    } catch (error) {
      console.error("❌ Cart error:", error.response?.data || error.message);
      showToast("error", "", "Failed to add item to cart");
    }
  }

  return (
    <Link
      to={`/shop/${_id}`}
      onClick={() =>
        localStorage.setItem(`${_id}`, JSON.stringify(productdetails))
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="card-basic wishlist-card">
        <img src={imgSrc} alt={imgAlt} />
        <div className="card-item-details">
          <div className="item-title">
            <h4>{bookName}</h4>
          </div>
          <h5 className="item-author">- By {author}</h5>
          <p>
            <b>Rs. {discountedPrice} </b>
            &nbsp;&nbsp;
            <del>Rs. {originalPrice}</del> &nbsp;&nbsp;
            <span className="discount-on-card">({discountPercent}% off)</span>
          </p>

          {/* ✅ Buttons */}
          <div className="card-actions">
            <button
              className="solid-danger-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromWishlist();
              }}
            >
              Remove
            </button>

            <button
              className="solid-primary-btn add-wishlist-item-to-cart-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItemToCart();
              }}
            >
              Add to Cart
            </button>
          </div>

          <div className="badge-on-card">{badgeText}</div>

          {outOfStock && (
            <div className="card-text-overlay-container">
              <p>Out of Stock</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export { WishlistProductCard };
