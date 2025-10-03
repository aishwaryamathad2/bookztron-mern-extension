import express from "express";
import {
  getMe,
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Logged-in user info
router.get("/me", protect, getMe);

// ✅ Admin user management
router.get("/", protect, allowRoles("admin"), getUsers);
router.get("/:id", protect, allowRoles("admin"), getUser);
router.put("/:id/role", protect, allowRoles("admin"), updateUserRole);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

// ✅ Wishlist & Cart
// ✅ Wishlist & Cart

// Wishlist
// Wishlist
router.post("/wishlist/:bookId", protect, addToWishlist);
router.delete("/wishlist/:bookId", protect, removeFromWishlist);

// Cart
router.post("/cart/:bookId", protect, addToCart);
router.delete("/cart/:bookId", protect, removeFromCart);



export default router;
