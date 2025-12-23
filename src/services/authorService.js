//authorservice
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ✅ Corrected - now uses API_URL properly
//authorservice
export const getMyBooks = async (authorId) => {
  const { data } = await axios.get(`http://localhost:5000/api/books/author/${authorId}`);
  return data;
};






// ✅ Profile
export const getMyProfile = async () => {
  const res = await axios.get(`${API_URL}/authors/me`, { headers: getAuthHeaders() });
  return res.data;
};



export const createBook = async (bookData) => {
  const res = await axios.post(`${API_URL}/books`, bookData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateBook = async (bookId, updates) => {
  const res = await axios.put(`${API_URL}/books/${bookId}`, updates, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deleteBook = async (bookId) => {
  const res = await axios.delete(`${API_URL}/books/${bookId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};







/*authorService
import axios from "axios";

const API_URL = "http://localhost:5000/api/authors";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // or wherever you store it
  return { Authorization: `Bearer ${token}` };
};

// must call the author route
export const getMyBooks = async (token) => {
  const res = await axios.get("/authors/books", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Profile
export const getMyProfile = async () => {
  const res = await axios.get(`${API_URL}/me`, { headers: getAuthHeaders() });
  return res.data;
};
export const createBook = async (bookData) => {
  const res = await axios.post(`${API_URL}/books`, bookData, { headers: getAuthHeaders() });
  return res.data;
};

export const updateBook = async (bookId, updates) => {
  const res = await axios.put(`${API_URL}/books/${bookId}`, updates, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteBook = async (bookId) => {
  const res = await axios.delete(`${API_URL}/books/${bookId}`, { headers: getAuthHeaders() });
  return res.data;
}; */
