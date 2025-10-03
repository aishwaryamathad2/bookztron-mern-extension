// src/Pages/author/AnaProposals.jsx
import React, { useState } from "react";
import "./AuthorDashboard.css";

function AnaProposals() {
  const [proposal, setProposal] = useState({
    title: "",
    category: "",
    content: "",
    publisher: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // show toast instead of alert
    setToastMessage(`✅ Proposal "${proposal.title}" submitted to ${proposal.publisher}!`);
    setShowToast(true);

    // auto-hide after 3 seconds
    setTimeout(() => setShowToast(false), 3000);

    // reset form
    setProposal({ title: "", category: "", content: "", publisher: "" });
  };

  return (
    <div className="section-container">
      <form className="proposal-form" onSubmit={handleSubmit}>
        <h2>Submit New Book Proposal</h2>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={proposal.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={proposal.category}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Brief Story / Content"
          value={proposal.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="publisher"
          placeholder="Proposed Publisher"
          value={proposal.publisher}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Proposal</button>
      </form>

      {/* Toast notification */}
      {showToast && (
        <div className="toast">{toastMessage}</div>
      )}
    </div>
  );
}

export default AnaProposals;
