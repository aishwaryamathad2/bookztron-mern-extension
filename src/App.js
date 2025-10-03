//app.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from "./Components/Navbar/Navbar";
import { Toast } from "./Components/Toast/Toast";

// Pages
import Home from "./Pages/Home/Home.jsx";
import Shop from "./Pages/Shop/Shop.jsx";
import { ProductPage } from "./Pages/ProductPage/ProductPage";
import { Login } from "./Pages/AuthenticationPages/Login";
import { Signup } from "./Pages/AuthenticationPages/Signup";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Orders from "./Pages/Orders/Orders.jsx";
import AddBook from "./Pages/AddBook/AddBook.js";

// Dashboards
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.js";
import UserDashboard from "./Pages/UserDashboard.js";
import AuthorDashboard from "./Pages/author/AuthorDashboard";
import PublisherDashboard from "./Pages/PublisherDashboard.js";

// Other pages
import { BookDetails } from "./Pages/BookDetails/BookDetails";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import BooksListing from "./Pages/BooksListing.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addbook" element={<AddBook />} />

        {/* Dashboards */}
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/user/dashboard/*" element={<UserDashboard />} />
        <Route path="/author/dashboard" element={<AuthorDashboard />} />
        <Route path="/publisher/dashboard/:id" element={<PublisherDashboard />} />

        {/* Book Listing */}
        <Route path="/books" element={<BooksListing />} />  
      </Routes>
    </Router>
  );
}

export default App;
