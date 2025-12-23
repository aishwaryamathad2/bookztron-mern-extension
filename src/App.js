// app.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AddBook from "./Pages/AddBook/AddBook.js"; // ✅ your new AddBook page
import BookDetails from "./Pages/BookDetails/BookDetails";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import BooksListing from "./Pages/BooksListing.jsx";

// Dashboards
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard.js";
import UserDashboard from "./Pages/UserDashboard.js";
import AuthorDashboard from "./Pages/author/AuthorDashboard";
import PublisherDashboard from "./Pages/Publisher/PublisherDashboard";
import PublisherProfile from "./Pages/Publisher/ProfileSection";
import PublisherBooks from "./Pages/Publisher/BooksSection";
import PublisherProposals from "./Pages/Publisher/ProposalsSection";
import PublisherInsights from "./Pages/Publisher/InsightsSection";

import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
{/* toast */}
<Toast position="bottom-right" />
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ---------- User Features ---------- */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />

          {/* ---------- Add Book Page ---------- */}
          {/* ✅ You already have this — it’s perfect */}
          <Route path="/addbook" element={<AddBook />} />

          {/* ---------- Dashboards ---------- */}
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          <Route path="/user/dashboard/*" element={<UserDashboard />} />
          <Route path="/author/dashboard/*" element={<AuthorDashboard />} /> {/* ✅ small fix: add /* for nested routes */}

          {/* ---------- Publisher Dashboard with Nested Routes ---------- */}
          <Route path="/publisher/dashboard/*" element={<PublisherDashboard />}>
            <Route path="profile" element={<PublisherProfile />} />
            <Route path="books" element={<PublisherBooks />} />
            <Route path="proposals" element={<PublisherProposals />} />
            <Route path="insights" element={<PublisherInsights />} />
          </Route>

          {/* ---------- Book Listing ---------- */}
          <Route path="/books" element={<BooksListing />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
