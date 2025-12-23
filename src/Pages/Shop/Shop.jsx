import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useLocation, Link } from "react-router-dom";
import "./Shop.css";
import { useWishlist, useCart, useSearchBar } from "../../index.js";
import { Pagination } from "../../Components/Pagination/Pagination.jsx";
import { useProductAvailable } from "../../Context/product-context";
import axios from "axios";

const fallbackImage = "https://via.placeholder.com/200x300?text=No+Image";

function Shop() {
  const { productsAvailableList, dispatchSortedProductsList } = useProductAvailable();
  const productsPerPage = 8;
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { pathname, state } = useLocation();
  const { searchBarTerm } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);
  const category = state?.category || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, currentPage]);

  useEffect(() => {
    (async () => {
      try {
        let url = category
          ? `${process.env.REACT_APP_API_URL}/api/books/category/${category}`
          : `${process.env.REACT_APP_API_URL}/api/books`;

        console.log("Fetching from 👉", url);
        const res = await axios.get(url);

        // ✅ Handle both `{books: [...]}` and direct `[]`
        const bookList = Array.isArray(res.data) ? res.data : res.data.books || [];

        dispatchSortedProductsList({
          type: "ADD_ITEMS_TO_PRODUCTS_AVAILABLE_LIST",
          payload: bookList,
        });

      } catch (error) {
        console.error("Error fetching books:", error);
      }
    })();
  }, [category, dispatchSortedProductsList]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const user = jwt_decode(token);
    if (!user) {
      localStorage.removeItem("token");
      return;
    }

    (async function getUpdatedWishlistAndCart() {
      let updatedUserInfo = await axios.get(
        "https://bookztron-server.vercel.app/api/user",
        {
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      );

      if (updatedUserInfo.data.status === "ok") {
        dispatchUserWishlist({
          type: "UPDATE_USER_WISHLIST",
          payload: updatedUserInfo.data.user.wishlist,
        });
        dispatchUserCart({
          type: "UPDATE_USER_CART",
          payload: updatedUserInfo.data.user.cart,
        });
      }
    })();
  }, [dispatchUserCart, dispatchUserWishlist]);

  let filteredBooks = productsAvailableList.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchBarTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchBarTerm.toLowerCase())
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  let currentBooks = filteredBooks.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="shop-container">
      <div className="products-container">
        <h2>Showing {filteredBooks.length} {category ? `${category} books` : "books"}</h2>

        <div className="books-card-grid">
          {currentBooks.map((book) => (
            <Link key={book._id} to={`/book/${book._id}`}>
              <div className="book-card">
                <img
                  src={book.coverUrl ? book.coverUrl : fallbackImage}
                  alt={book.title}
                  onError={(e) => (e.target.src = fallbackImage)}
                  className="book-img"
                />
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">By {book.author}</p>
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          productsPerPage={productsPerPage}
          totalProducts={filteredBooks.length}
          paginate={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Shop;
