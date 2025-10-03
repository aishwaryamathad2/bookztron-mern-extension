// src/pages/ProductsPage.js
import React from "react";
import { useProducts } from "../Context/product-context";

const ProductsPage = () => {
  const { productsAvailableList } = useProducts();

  return (
    <div className="products-page">
      <h2>Available Books</h2>
      <div className="products-grid">
        {productsAvailableList.length === 0 ? (
          <p>No books available</p>
        ) : (
          productsAvailableList.map((book) => (
            <div key={book._id} className="product-card">
              <img src={book.coverImage} alt={book.title} width="150" />
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>₹{book.discountedPrice}</p>
              <button>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
