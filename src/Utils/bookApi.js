//bookApi
import api from "./api"; // your axios instance

// Fetch books belonging to the logged-in publisher
export const getMyBooks = async () => {
  const { data } = await api.get("/books/my");
  return data;
};

// Create a book (if publisher wants to add)
export const createBook = async (bookData) => {
  const { data } = await api.post("/books", bookData);
  return data;
};

// Approve book proposal (publisher)
export const approveBook = async (id) => {
  const { data } = await api.put(`/books/${id}/approve`);
  return data;
};

// Reject book proposal (publisher)
export const rejectBook = async (id) => {
  const { data } = await api.put(`/books/${id}/reject`);
  return data;
};
