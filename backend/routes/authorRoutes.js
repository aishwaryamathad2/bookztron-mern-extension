// backend/routes/authorRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getMyProfile,
  getAuthorProfile,
  createBook,
  getMyBooks,
  updateBook,
  deleteBook,
} from "../controllers/authorController.js";

const router = express.Router();

// Author profile routes
router.get("/me", protect, getMyProfile);
router.get("/:id", protect, getAuthorProfile); // protected so only logged-in can view details

// Books (author)
router.post("/books", protect, allowRoles("author", "publisher", "admin"), createBook);
router.get("/books", protect, allowRoles("author", "publisher", "admin"), getMyBooks);
router.put("/books/:bookId", protect, allowRoles("author", "publisher", "admin"), updateBook);
router.delete("/books/:bookId", protect, allowRoles("author", "publisher", "admin"), deleteBook);

export default router;
