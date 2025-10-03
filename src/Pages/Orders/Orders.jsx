import "./Orders.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { ProductOrderCard } from "../../Components/ProductOrderCard/ProductOrderCard.jsx";
import Lottie from "lottie-react";
import GuyWithBookLottie from "../../Assets/Icons/guy_with_book.json";

function Orders() {
  const [userOrders, setUserOrders] = useState([]);
  const { pathname } = useLocation();

  // scroll top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // get token after login
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ send token
            },
            withCredentials: true,
          }
        );
        setUserOrders(data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-content-container">
      <h2>
        {userOrders.length}{" "}
        {userOrders.length === 1 ? "order" : "orders"} placed
      </h2>

      {userOrders.length === 0 ? (
        <div className="no-orders-message-container">
          <Lottie
            animationData={GuyWithBookLottie}
            loop
            autoplay
            style={{ height: 350, width: 350 }}
          />
          <h2>You have not placed any orders</h2>
          <Link to="/cart">
            <button className="solid-primary-btn">Go to cart</button>
          </Link>
        </div>
      ) : (
        <div className="orders-container">
          {userOrders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order ID: {order._id}</h3>
              <p>
                <strong>Placed On:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>

              <div className="order-items">
                {order.items?.map((item, idx) => (
                  <ProductOrderCard
                    key={idx}
                    productDetails={{
                      _id: item.bookId?._id,
                      bookName: item.bookId?.title || item.title,
                      author: item.bookId?.author || item.author,
                      price: item.bookId?.price || item.price,
                      imgSrc:
                        item.bookId?.coverUrl ||
                        item.coverUrl ||
                        "https://via.placeholder.com/100x150",
                      quantity: item.quantity,
                    }}
                  />
                ))}
              </div>

              <h4 className="order-total">
                Total Amount: ₹{order.totalAmount}
              </h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
