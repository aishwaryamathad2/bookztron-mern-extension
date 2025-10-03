import express from "express";
import {
  getProposals,
  approveProposal,
  rejectProposal,
  getPublishedBooks,
} from "../controllers/publisherController.js";

const router = express.Router();

// 📌 Get all pending book proposals (sent by authors)
router.get("/proposals", getProposals);

// 📌 Approve a proposal → make it a published book
router.post("/proposals/:proposalId/approve", approveProposal);

// 📌 Reject a proposal
router.post("/proposals/:proposalId/reject", rejectProposal);

// 📌 Get all published books by publisher
router.get("/books", getPublishedBooks);

export default router;
