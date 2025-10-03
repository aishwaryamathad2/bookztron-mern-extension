import React, { useState, useEffect } from "react";
import axios from "axios";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash on delivery");
  const [user, setUser] = useState(null);

  // ✅ Fetch cart & user
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartArray = Array.isArray(data) ? data : data.cart || [];
        setCart(cartArray);

        const total = cartArray.reduce(
          (sum, item) => sum + (item.book?.price || 0) * item.quantity,
          0
        );
        setTotalAmount(total);
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };

    fetchCart();
    fetchUser();
  }, []);

  // ✅ Place order
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
  contactNumber,
  address,
  paymentMethod, // ✅ no .toLowerCase()
  items: cart.map((item) => ({
  bookId: item.book?._id || item._id, // ✅ prefer book._id if available
  title: item.book?.title || item.title,
  coverUrl: item.book?.coverUrl || item.coverUrl,
  price: item.book?.price || item.price,
  quantity: item.quantity,
})),

  totalAmount,
};


      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Order placed successfully!");
      setCart([]);
      setTotalAmount(0);
      setContactNumber("");
      setAddress("");
      setPaymentMethod("cash on delivery");
    } catch (err) {
      console.error("❌ Order failed:", err.response?.data || err.message);
      alert("❌ Failed to place order. Check console for details.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {user && (
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      )}

      <div className="border rounded p-4 mb-4">
        <h3 className="font-semibold mb-2">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item._id || item.book?._id} className="flex justify-between mb-2">
              <span>
                {item.book?.title || item.title} (x{item.quantity})
              </span>
              <span>₹{(item.book?.price || item.price || 0) * item.quantity}</span>
            </div>
          ))
        )}
        <hr className="my-2" />
        <p className="font-bold text-lg">Total: ₹{totalAmount}</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="w-full border rounded p-2"
        />
        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded p-2"
        />
    <select
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
  className="w-full border rounded p-2"
>
  <option value="Cash on Delivery">cash on delivery</option>
  <option value="Rupay">Rupay</option>
  <option value="UPI">UPI</option>
</select>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
