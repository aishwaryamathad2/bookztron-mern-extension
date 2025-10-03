import React, { createContext, useReducer, useContext, useEffect } from "react";
import API from "../Utils/api"; // ✅ import the axios instance
//import axios from "axios";
// Initial state
const initialState = [];

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find(
        (item) => item.book && item.book._id === action.payload.book._id
      );
      if (existing) {
        return state.map((item) =>
          item.book._id === action.payload.book._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.book && item.book._id !== action.payload);

    case "UPDATE_USER_CART":
      return action.payload;

    default:
      return state;
  }
}

// Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [userCart, dispatchUserCart] = useReducer(cartReducer, initialState);

  // ✅ Fetch cart from backend once on mount
useEffect(() => {
  async function fetchCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No token found. Skipping cart fetch.");
      return; // ✅ Don't call API if not logged in
    }

    try {
  const res = await API.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

  dispatchUserCart({
    type: "UPDATE_USER_CART",
    payload: res.data.cart || [],
  });
} catch (err) {
  console.error("❌ Error fetching cart:", err);
}

  }

  fetchCart();
}, []);


  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userCart", JSON.stringify(userCart));
  }, [userCart]);

  return (
    <CartContext.Provider value={{ userCart, dispatchUserCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart
export const useCart = () => useContext(CartContext);
