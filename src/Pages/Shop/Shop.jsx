import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";
import "./Shop.css";
import {
  //Sidebar,
  useWishlist,
  useCart,
  useSearchBar,
} from "../../index.js";
import { Pagination } from "../../Components/Pagination/Pagination.jsx";

import { useProductAvailable } from "../../Context/product-context";
import axios from "axios";
import { Link } from "react-router-dom";
const sampleReviews = [
  { user: "Ravi", comment: "Good book!" },
  { user: "Shami", comment: "Nice read." },
  { user: "Anita", comment: "Very interesting." },
  { user: "Vikram", comment: "Loved it!" },
  { user: "Priya", comment: "Could be better." },
  { user: "Kiran", comment: "Amazing story!" },
];

function addRandomRatingAndReviews(books) {
  return books.map((book) => {
    const randomRating = (Math.random() * 5).toFixed(1); // ⭐ between 0–5
    const randomReviews = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
      return sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
    });

    return {
      ...book,
      rating: randomRating,
      reviews: randomReviews,
    };
  });
}


function Shop() {
  let { productsAvailableList, dispatchSortedProductsList } =
    useProductAvailable();

  const productsPerPage = 8;
  const { dispatchUserWishlist } = useWishlist();
  const { dispatchUserCart } = useCart();
  const { pathname, state } = useLocation();
  const { searchBarTerm } = useSearchBar();
  const [currentPage, setCurrentPage] = useState(1);

  // genre passed from Home.jsx
  const category = state?.category || null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, currentPage]);

  // ✅ Fetch books by genre (or all if no genre)
  useEffect(() => {
  (async () => {
    try {
      let url = category
        ? `${process.env.REACT_APP_API_URL}/api/books/category/${category}`
        : `${process.env.REACT_APP_API_URL}/api/books`;

      console.log("Fetching from 👉", url);   // ✅ check exact URL

      const res = await axios.get(url);

      console.log("Books API response 👉", res.data);   // ✅ log what API returns
      dispatchSortedProductsList({
        type: "ADD_ITEMS_TO_PRODUCTS_AVAILABLE_LIST",
        payload: addRandomRatingAndReviews(res.data.books || res.data),
      });

    } catch (error) {
      console.error("Error fetching books:", error);
    }
  })();
}, [category, dispatchSortedProductsList]);


  // ✅ Fetch user wishlist & cart if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt_decode(token);
      if (!user) {
        localStorage.removeItem("token");
      } else {
        (async function getUpdatedWishlistAndCart() {
          let updatedUserInfo = await axios.get(
            "https://bookztron-server.vercel.app/api/user",
            {
              headers: {
                "x-access-token": localStorage.getItem("token"),
              },
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
      }
    }
  }, [dispatchUserCart, dispatchUserWishlist]);

  // ✅ Apply search
  let filteredBooks = productsAvailableList.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchBarTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchBarTerm.toLowerCase())
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  let currentBooks = filteredBooks.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div>
      <div className="shop-container">
        { /*<Sidebar />  */}
        <div className="products-container">
        <h2>Showing {filteredBooks.length} {category ? `${category} books` : "books"}</h2>


        <div className="books-card-grid">
  {currentBooks.map((book) => (
    <Link key={book._id} to={`/book/${book._id}`}>
      <div className="book-card">
        <img
          src={
            book.coverUrl?.replace("1000", "200") ||
            "https://via.placeholder.com/150"
          }
          alt={book.title}
          loading="lazy"
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
    </div>
  );
}

export default Shop 
