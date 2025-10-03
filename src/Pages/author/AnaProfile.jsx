// src/Pages/author/AnaProfile.jsx
import React, { useState, useEffect } from "react";
import "./AuthorDashboard.css";

function AnaProfile() {
  const defaultProfile = {
    name: "Ana Huang",
    bio: "Ana Huang is a New York Times, USA Today, international, and #1 Amazon bestselling author of contemporary romance. She’s best known for her Twisted series (Twisted Love, Twisted Games, Twisted Lies, Twisted Hate) and the Kings of Sin series (King of Wrath, King of Envy, etc.). Her books are translated into more than two dozen languages and have sold millions of copies worldwide. Outside of writing, Ana loves traveling, eating dessert, and binging Netflix dramas. She grew up in the U.S. but also draws inspiration from her Asian heritage.",
    image: "/books/anahuang.jpeg",
    books: [
      "Twisted Love",
      "Twisted Hate",
      "Twisted Lies",
      "King of Wrath",
      "King of Envy",
      "King of Sloth",
    ],
  };

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("anaProfile");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [newBook, setNewBook] = useState("");

  useEffect(() => {
    localStorage.setItem("anaProfile", JSON.stringify(profile));
  }, [profile]);

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleAddBook = () => {
    if (newBook.trim() !== "") {
      setTempProfile({
        ...tempProfile,
        books: [...tempProfile.books, newBook.trim()],
      });
      setNewBook("");
    }
  };

  const handleDeleteBook = (index) => {
    setTempProfile({
      ...tempProfile,
      books: tempProfile.books.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="profile-container">
      <h2 className="section-title">Author Profile</h2>
      <div className="profile-card">
        <div className="profile-left">
          <img src={profile.image} alt={profile.name} className="profile-image" />
        </div>
        <div className="profile-right">
          <h3 className="profile-name">{profile.name}</h3>
          <p className="profile-bio">{profile.bio}</p>

         <h4 className="books-title">Famous Books:</h4>
          <ul className="books-list">
            {profile.books.map((book, index) => (
              <li key={index}>{book}</li>
            ))}
          </ul>  

          <button className="edit-btn" onClick={() => {
            setTempProfile(profile);
            setIsEditing(true);
          }}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <input
              type="text"
              value={tempProfile.name}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, name: e.target.value })
              }
              placeholder="Author Name"
            />
            <textarea
              value={tempProfile.bio}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, bio: e.target.value })
              }
              placeholder="Author Bio"
              rows="4"
            />
            <input
              type="text"
              value={tempProfile.image}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, image: e.target.value })
              }
              placeholder="Image URL"
            />

            {/* Books Section inside Edit Profile */}
            <h4>Famous Books</h4>
            <ul className="books-list">
              {tempProfile.books.map((book, index) => (
                <li key={index}>
                  {book}
                  <button onClick={() => handleDeleteBook(index)}>🗑️</button>
                </li>
              ))}
            </ul>

            <div className="add-book">
              <input
                type="text"
                value={newBook}
                onChange={(e) => setNewBook(e.target.value)}
                placeholder="Add a new book"
              />
              <button onClick={handleAddBook}>Add</button>
            </div>

            <div className="modal-actions">
              <button onClick={handleSaveProfile}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnaProfile;
