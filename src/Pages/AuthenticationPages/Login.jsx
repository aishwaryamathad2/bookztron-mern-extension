//src/Pages/Authentication/login.jsx
import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import "./UserAuth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext"; 

import {
  useToast,
  useUserLogin,
  useWishlist,
  useCart,
  useOrders
} from "../../index";

function Login() {
  const { setUserLoggedIn } = useUserLogin();
  const { showToast } = useToast();
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { dispatchUserOrders } = useOrders();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { login } = useAuth(); // ✅ NOW WE WILL USE THIS PROPERLY

  const navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: userEmail,
        password: userPassword,
      });

      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid login response");

      // ✅ USE AuthContext login instead of manual localStorage only
      login(user, token);

      // ✅ Sync wishlist/cart/orders if needed
      dispatchUserWishlist({ type: "UPDATE_USER_WISHLIST", payload: res.data.wishlist || [] });
      dispatchUserCart({ type: "UPDATE_USER_CART", payload: res.data.cart || [] });
      dispatchUserOrders({ type: "UPDATE_USER_ORDERS", payload: res.data.orders || [] });

      showToast("success", "", "Logged in successfully");
      setUserLoggedIn(true);

      // ✅ Role-based redirect
      console.log("Decoded JWT:", jwt_decode(token));
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "author") navigate("/author/dashboard");
      else if (user.role === "publisher") navigate("/publisher/dashboard");
      else navigate("/");
      
    } catch (err) {
      console.error("Login failed:", err);
      showToast("error", "", "Error logging in user. Please try again");
    }
  }

  return (
    <div className="user-auth-content-container">
      <form onSubmit={loginUser} className="user-auth-form">
        <h2>Login</h2>

        <input type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required />

        <button type="submit" className="solid-success-btn form-user-auth-submit-btn">Login</button>

        <div className="new-user-container">
          <Link to="/signup" className="links-with-blue-underline">Create new account</Link>
        </div>
      </form>
    </div>
  );
}

export { Login };
