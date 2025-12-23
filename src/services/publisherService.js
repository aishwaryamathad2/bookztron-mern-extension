// src/services/publisherService.js
import api from "../Utils/axiosInstance";
import axios from "axios";

// ✅ Base API URL (for books)
const API_URL = "http://localhost:5000/api/books";

// ✅ Fetch publisher profile
export const getPublisherProfile = () => api.get("/publisher/profile");

// ✅ Fetch all books of this publisher
// src/services/publisherService.js
//import axios from "axios";

//const API_URL = "http://localhost:5000/api/books";

// ✅ Fetch all books of this publisher
export const getPublisherBooks = async () => {
  return axios.get(`${API_URL}/publisher/books`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// ✅ Update book price
export const updatePublisherBookPrice = (bookId, price) => {
  return axios.put(
    `${API_URL}/${bookId}`,
    { price },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// ✅ Delete book
export const deletePublisherBook = (bookId) => {
  return axios.delete(`${API_URL}/${bookId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


// ✅ Fetch proposals
export const getPublisherProposals = () => api.get("/publisher/proposals");

// ✅ Accept proposal
export const acceptPublisherProposal = (proposalId) =>
  api.put(`/publisher/proposals/${proposalId}/accept`);

// ✅ Reject proposal
export const rejectPublisherProposal = (proposalId) =>
  api.put(`/publisher/proposals/${proposalId}/reject`);

// ✅ Get insights (analytics)
export const getPublisherInsights = () => api.get("/publisher/insights");
