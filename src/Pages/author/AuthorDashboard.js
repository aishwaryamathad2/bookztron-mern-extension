/* import { useEffect, useState } from "react";
import axiosInstance from "../../Utils/axiosinstance";

export default function AuthorDashboard() {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data } = await axiosInstance.get("/authors/me"); // ✅ now using axiosInstance
        setAuthor(data);
      } catch (err) {
        console.error("❌ Error fetching author:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!author) return <p className="text-red-500">Author not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{author.name}’s Dashboard</h2>
      <p>Email: {author.email}</p>
      <p>Bio: {author.bio}</p>

      {author.books && author.books.length > 0 ? (
        <ul className="list-disc ml-6">
          {author.books.map((book) => (
            <li key={book._id}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p>No books yet.</p>
      )}
    </div>
  );
} */


// src/Pages/author/AuthorDashboard.js
import { useEffect, useState, useContext } from "react";
import { useAuth } from "../../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"; // ✅ ADDED THIS LINE

// Import services
import {
  getMyProfile,
  getMyBooks,
  createBook,
  deleteBook,
  updateBook,
} from "../../services/authorService";

// Import your 4 section components
import Profile from "./AnaProfile";
import Books from "./AnaBooksList";
import Proposals from "./AnaProposals";
import Insights from "./AnaSalesInsights";

import "./AuthorDashboard.css";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchBooks();
  }, []);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
const data = await getMyBooks(user.id || user._id);
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // Handle add book (you can remove this later if not needed)
  const handleAddBook = async (bookData) => {
    try {
      await createBook(bookData);
      fetchBooks();
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  // Handle delete book
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  // Handle update book
  const handleUpdateBook = async (bookId, updatedData) => {
    try {
      const response = await axios.put(`/api/books/${bookId}`, updatedData);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId ? { ...book, ...response.data } : book
        )
      );
      toast.success("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    }
  };

  return (
    <div className="author-dashboard">
      <h2>Welcome, {user?.name || "Author"}</h2>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab("profile")}>Profile</button>
        <button onClick={() => setActiveTab("books")}>Books</button>
        <button onClick={() => setActiveTab("proposals")}>Proposals</button>
        <button onClick={() => setActiveTab("insights")}>Insights</button>
      </div>

      <div className="dashboard-content">
        {activeTab === "profile" && <Profile profile={profileData} />}
        {activeTab === "books" && (
          <Books
            books={books}
            onAdd={handleAddBook}
            onDelete={handleDeleteBook}
            onUpdate={handleUpdateBook}
          />
        )}
        {activeTab === "proposals" && <Proposals />}
        {activeTab === "insights" && <Insights />}
      </div>

      {/* ✅ Toast Container */}
      <Toaster position="top-center" />
    </div>
  );
};

export default AuthorDashboard;
