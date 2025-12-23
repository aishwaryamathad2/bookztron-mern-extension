// src/Pages/author/AnaProposals.jsx
import React, { useState, useEffect } from "react";
import "./AuthorDashboard.css";
import axios from "axios";

function AnaProposals() {
  const [proposal, setProposal] = useState({
    title: "",
    category: "",
    content: "",
    publisher: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [myProposals, setMyProposals] = useState([]); // ✅ new state for author's proposals

  const handleChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  // ✅ Fetch proposals submitted by this author
  useEffect(() => {
    const fetchMyProposals = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/proposals/myproposals", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMyProposals(res.data);
      } catch (err) {
        console.error("❌ Error fetching my proposals:", err);
      }
    };

    fetchMyProposals();
  }, []); // runs once when component loads

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in before submitting a proposal.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: proposal.title,
          category: proposal.category,
          content: proposal.content,
          publisher: proposal.publisher,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit proposal");
      }

      const data = await res.json();
      console.log("✅ Proposal submitted:", data);

      setToastMessage(`✅ Proposal "${proposal.title}" submitted to ${proposal.publisher}!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setProposal({ title: "", category: "", content: "", publisher: "" });

      // ✅ Refresh proposals list after submission
      setMyProposals((prev) => [...prev, data.proposal]);
    } catch (error) {
      console.error("❌ Proposal submit error:", error);
      alert("Failed to submit proposal. Please try again.");
    }
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
      {showToast && <div className="toast">{toastMessage}</div>}

      {/* ✅ Display Author's Submitted Proposals */}
      <div className="proposals-list">
        <h3>My Submitted Proposals</h3>
        {myProposals.length === 0 ? (
          <p>No proposals submitted yet.</p>
        ) : (
          <table className="proposal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Publisher</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myProposals.map((p) => (
                <tr key={p._id}>
                  <td>{p.bookTitle}</td>
                  <td>{p.publisherName}</td>
                  <td>{p.category || "Romance"}</td>
                  <td>
  {p.status === "pending" && <span style={{ color: "orange" }}>Pending</span>}
  {p.status === "accepted" && <span style={{ color: "green" }}>Accepted</span>}
  {p.status === "rejected" && <span style={{ color: "red" }}>Rejected</span>}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AnaProposals;
