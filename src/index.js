import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Context Providers
import { ProductsProvider } from "./Context/product-context";
import { GenreProvider } from "./Context/genre-context";
import { ToastContextProvider } from "./Context/toast-context";
import { UserLoginContextProvider } from "./Context/user-login-context";
import { WishlistContextProvider } from "./Context/wishlist-context";
import { OrdersContextProvider } from "./Context/orders-context";
import { SearchBarContextProvider } from "./Context/search-bar-context";
import { CartProvider } from "./Context/CartProvider"; 

// ✅ React 18 createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserLoginContextProvider>
      <WishlistContextProvider>
        <CartProvider>
          <ToastContextProvider>
            <GenreProvider>
              <ProductsProvider>
                <OrdersContextProvider>
                  <SearchBarContextProvider>
                    <App />
                  </SearchBarContextProvider>
                </OrdersContextProvider>
              </ProductsProvider>
            </GenreProvider>
          </ToastContextProvider>
        </CartProvider>
      </WishlistContextProvider>
    </UserLoginContextProvider>
  </React.StrictMode>
);

// ✅ Export hooks only ONCE
export { useToast } from "./Context/toast-context";
export { useWishlist } from "./Context/wishlist-context";
export { useCart } from "./Context/CartProvider";
export { useOrders } from "./Context/orders-context";
export { useUserLogin } from "./Context/user-login-context";
export { useSearchBar } from "./Context/search-bar-context";
