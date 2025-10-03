//bookroutes
import { Router } from "express";
import {
  listBooks,
  listBooksByCategory,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  approveBook,
  rejectBook,
  adminListBooks,
  adminUpdateBook,
  adminDeleteBook,
  addReview,            // ✅ new
  deleteReview          // ✅ new
} from "../controllers/bookController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// 📚 Public
router.get("/", listBooks);
router.get("/admin/all", protect, allowRoles("admin"), adminListBooks);
// bookRoutes.js
router.get("/category/:category", listBooksByCategory);
router.get("/:id", getBook);

// ✍️ Author/Publisher/Admin
router.post("/", protect, allowRoles("author", "publisher", "admin"), createBook);
router.put("/:id", protect, allowRoles("author", "publisher", "admin"), updateBook);
router.delete("/:id", protect, allowRoles("author", "publisher", "admin"), deleteBook);

// ✅ Publisher/Admin
router.put("/:id/approve", protect, allowRoles("publisher", "admin"), approveBook);
router.put("/:id/reject", protect, allowRoles("publisher", "admin"), rejectBook);

// 👑 Admin only
router.put("/admin/:id", protect, allowRoles("admin"), adminUpdateBook);
router.delete("/admin/:id", protect, allowRoles("admin"), adminDeleteBook);

// ⭐ Reviews
router.post("/:id/reviews", protect, addReview);              // Add review
router.delete("/:id/reviews/:reviewId", protect, deleteReview); // Delete review

export default router;
