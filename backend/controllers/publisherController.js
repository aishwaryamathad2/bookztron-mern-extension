import Book from "../models/Book.js";
import Proposal from "../models/Proposal.js"; 

// Get all proposals
export const getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: "pending" });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve proposal
export const approveProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.status = "approved";
    await proposal.save();

    // Create book entry after approval
    const newBook = new Book({
      title: proposal.title,
      author: proposal.author,
      description: proposal.description,
      price: proposal.price,
      category: proposal.category,
    });
    await newBook.save();

    res.json({ message: "Proposal approved & book published", book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject proposal
export const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.status = "rejected";
    await proposal.save();

    res.json({ message: "Proposal rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get published books
export const getPublishedBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
