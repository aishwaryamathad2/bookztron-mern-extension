import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// hooks
import { useToast, useCart, useWishlist } from "../../index";

import "./HorizontalProductCard.css";

function HorizontalProductCard({ productDetails, hideActions = false }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();

  const {
    _id,
    bookName,
    author,
    price,   // ✅ only one price now
    imgSrc,
    imgAlt,
    badgeText,
    quantity,
  } = productDetails;

  // ✅ safe default for quantity
  const [productQuantity, setProductQuantity] = useState(Number(quantity) || 1);

  // ✅ update cart when user clicks +/- or edits
  async function updateQuantity(newQuantity) {
    if (newQuantity < 1) return;

    setProductQuantity(newQuantity);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("warning", "", "Kindly Login");
        return navigate("/login");
      }

      const res = await axios.patch(
        `http://localhost:5000/api/cart/${_id}`,
        { newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "ok") {
        dispatchUserCart({
          type: "UPDATE_USER_CART",
          payload: res.data.user.cart,
        });
      } else {
        showToast("error", "", "Something went wrong!");
      }
    } catch (err) {
      showToast("error", "", "Failed to update quantity!");
    }
  }

  // ✅ remove item
  async function removeItemFromCart() {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("warning", "", "Kindly Login");
      return navigate("/login");
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/${_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "ok") {
        dispatchUserCart({
          type: "UPDATE_USER_CART",
          payload: res.data.user.cart,
        });
        showToast("success", "", "Item successfully deleted from cart");
      }
    } catch (err) {
      showToast("error", "", "Failed to remove item from cart!");
    }
  }

  // ✅ add to wishlist
  async function addItemToWishlist() {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("warning", "", "Kindly Login");
      return navigate("/login");
    }

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/wishlist",
        { bookId: _id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "ok") {
        dispatchUserWishlist({
          type: "UPDATE_USER_WISHLIST",
          payload: res.data.user.wishlist,
        });
        showToast("success", "", "Item successfully added to wishlist");
      }
    } catch (err) {
      showToast("error", "", "Failed to add item to wishlist!");
    }
  }

  return (
    <div className="card-basic-horizontal">
      <img className="cart-item-book-img" src={imgSrc} alt={imgAlt || "Book"} />
      <div id="cart-item-detail" className="card-item-details">
        <h4 id="item-title">{bookName}</h4>
        <p className="item-author">- By &nbsp;{author}</p>

        {/* ✅ Only real price */}
        <p className="price-details">₹ {price}</p>

        {/* ✅ Quantity controls (only if hideActions = false) */}
        {!hideActions && (
          <div className="item-cart-quantity">
            <p className="cart-quantity-para">Quantity : &nbsp;&nbsp;</p>
            <div className="quantity-manage-container">
              <div
                className="quantity-change"
                onClick={() => updateQuantity(productQuantity - 1)}
              >
                -
              </div>
              <input
                className="cart-item-quantity-input"
                value={productQuantity}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  updateQuantity(val);
                }}
                type="text"
                maxLength="3"
                autoComplete="off"
              />
              <div
                className="quantity-change"
                onClick={() => updateQuantity(productQuantity + 1)}
              >
                +
              </div>
            </div>
          </div>
        )}

        {/* ✅ Buttons (only if hideActions = false) */}
        {!hideActions && (
          <div className="cart-horizontal-card-btns card-button">
            <button className="solid-primary-btn" onClick={removeItemFromCart}>
              Remove from Cart
            </button>
            <button className="outline-primary-btn" onClick={addItemToWishlist}>
              Add to Wishlist
            </button>
          </div>
        )}

        {badgeText && <div className="badge-on-card">{badgeText}</div>}
      </div>
    </div>
  );
}

export { HorizontalProductCard };
