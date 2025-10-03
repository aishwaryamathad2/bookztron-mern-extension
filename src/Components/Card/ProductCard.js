import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import './ProductCard.css';
import { useToast } from '../../Context/toast-context';
import { useWishlist } from '../../Context/wishlist-context';

function ProductCard({ productdetails }) {
  const navigate = useNavigate();
  const { userWishlist, dispatchUserWishlist } = useWishlist();
  const { showToast } = useToast();

  const {
    _id,
    title,
    author,
    price,
    description,
    stock,
    coverUrl
  } = productdetails;

  const [wishlistHeartIcon, setWishlistHeartIcon] = useState("fa-heart-o");
  const [wishlistBtn, setWishlistBtn] = useState("add-to-wishlist-btn");

  useEffect(() => {
    const index = userWishlist.findIndex(product => product._id === _id);
    if (index !== -1) {
      setWishlistHeartIcon("fa-heart");
      setWishlistBtn("added-to-wishlist-btn");
    } else {
      setWishlistHeartIcon("fa-heart-o");
      setWishlistBtn("add-to-wishlist-btn");
    }
  }, [userWishlist, _id]);

  async function addOrRemoveItemToWishlist() {
    const token = localStorage.getItem('token');
    if (!token) {
      showToast("warning", "", "Kindly Login");
      navigate('/login');
      return;
    }

    const user = jwt_decode(token);
    if (!user) {
      localStorage.removeItem('token');
      showToast("warning", "", "Kindly Login");
      navigate('/login');
      return;
    }

    if (wishlistHeartIcon === "fa-heart-o") {
      // Add to wishlist
      let res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/wishlist`,
        { productdetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "ok") {
        setWishlistHeartIcon("fa-heart");
        setWishlistBtn("added-to-wishlist-btn");
        dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: res.data.user.wishlist });
        showToast("success", "", "Item added to wishlist");
      }
    } else {
      // Remove from wishlist
      let res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/wishlist/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "ok") {
        setWishlistHeartIcon("fa-heart-o");
        setWishlistBtn("add-to-wishlist-btn");
        dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: res.data.user.wishlist });
        showToast("success", "", "Item removed from wishlist");
      }
    }
  }

  return (
    <Link
      to={`/shop/${_id}`}
      onClick={() => localStorage.setItem(`${_id}`, JSON.stringify(productdetails))}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="card-basic">
        <img src={coverUrl || "https://via.placeholder.com/150"} alt={title} />
        <div className="card-item-details">
          <div className="item-title">
            <h4>{title}</h4>
          </div>
          <h5 className="item-author">- By {author || "Unknown"}</h5>
          <p><b>₹ {price}</b></p>
          <p className="description">{description?.substring(0, 60)}...</p>

          <div className="card-button">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addOrRemoveItemToWishlist();
              }}
              className={`card-icon-btn ${wishlistBtn} outline-card-secondary-btn`}
            >
              <i className={`fa fa-x ${wishlistHeartIcon}`} aria-hidden="true"></i>
            </button>
          </div>

          {stock <= 0 && (
            <div className="card-text-overlay-container">
              <p>Out of Stock</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
