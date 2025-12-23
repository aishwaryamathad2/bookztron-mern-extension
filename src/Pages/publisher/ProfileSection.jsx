// ProfileSection.jsx
import React, { useState, useEffect } from "react";

const defaultPublisherData = {
  logo:
    "data:image/png;base64,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",
  name: "Bloom Books Publishing",
  bio: "Bloom Books is a leading romance and fiction publisher known for...",

  famousBooks: [
    { title: "Twisted Love" },
    { title: "Twisted Lies" },
    { title: "It Ends With Us" },
  ],

  awards: [
    { title: "Best Romance Publisher 2022" },
    { title: "Readers' Choice Award 2023" },
  ],
};

const ProfileSection = () => {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(defaultPublisherData);

  // Load saved values from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("publisherProfile");
    if (saved) setProfileData(JSON.parse(saved));
  }, []);

  // Handle simple text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding item to list
  const addItem = (section) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: [...prev[section], { title: "" }],
    }));
  };

  // Handle list item change
  const updateItem = (section, index, value) => {
    const updated = [...profileData[section]];
    updated[index].title = value;
    setProfileData((prev) => ({
      ...prev,
      [section]: updated,
    }));
  };

  // Remove item
  const removeItem = (section, index) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Handle logo upload (fix: no compression)
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        logo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // Save everything
  const handleSave = () => {
    localStorage.setItem("publisherProfile", JSON.stringify(profileData));
    setEditing(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "650px" }}>
      <h2>Publisher Profile</h2>

      {/* Logo */}
      <div style={{ marginBottom: "20px" }}>
        <img
          src={profileData.logo}
          alt="Logo"
          style={{
            maxWidth: "200px",
            maxHeight: "200px",
            borderRadius: "10px",
            objectFit: "contain",
          }}
        />
      </div>

      {editing && (
        <input type="file" accept="image/*" onChange={handleLogoChange} />
      )}

      {/* Name */}
      <div style={{ marginTop: "20px" }}>
        <label>Name:</label>
        {editing ? (
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
          />
        ) : (
          <p>{profileData.name}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label>Bio:</label>
        {editing ? (
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
          />
        ) : (
          <p>{profileData.bio}</p>
        )}
      </div>

      {/* Famous Books */}
      <div style={{ marginTop: "20px" }}>
        <h3>Famous Books</h3>
        {profileData.famousBooks.map((book, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "8px" }}>
            {editing ? (
              <>
                <input
                  type="text"
                  value={book.title}
                  onChange={(e) =>
                    updateItem("famousBooks", index, e.target.value)
                  }
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => removeItem("famousBooks", index)}
                  style={{ marginLeft: "5px", color: "red" }}
                >
                  ✕
                </button>
              </>
            ) : (
              <p>{book.title}</p>
            )}
          </div>
        ))}
        {editing && (
          <button onClick={() => addItem("famousBooks")}>+ Add Book</button>
        )}
      </div>

      {/* Awards */}
      <div style={{ marginTop: "20px" }}>
        <h3>Awards</h3>
        {profileData.awards.map((award, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "8px" }}>
            {editing ? (
              <>
                <input
                  type="text"
                  value={award.title}
                  onChange={(e) =>
                    updateItem("awards", index, e.target.value)
                  }
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => removeItem("awards", index)}
                  style={{ marginLeft: "5px", color: "red" }}
                >
                  ✕
                </button>
              </>
            ) : (
              <p>{award.title}</p>
            )}
          </div>
        ))}
        {editing && (
          <button onClick={() => addItem("awards")}>+ Add Award</button>
        )}
      </div>

      {/* Buttons */}
      <button onClick={() => setEditing(!editing)} style={{ marginRight: "10px" }}>
        {editing ? "Cancel" : "Edit"}
      </button>

      {editing && <button onClick={handleSave}>Save</button>}
    </div>
  );
};

export default ProfileSection;
