// src/Pages/Publisher/ProposalsSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const PublisherProposals = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // use logged-in publisher name if available, else fallback
        const publisherName = user?.name || "Bloom Books";
        console.log("📡 Fetching proposals for:", publisherName);

        const res = await axios.get(
          `http://localhost:5000/api/proposals/publisher/${encodeURIComponent(
            publisherName
          )}`
        );

        console.log("✅ Proposals fetched:", res.data);
        setProposals(res.data);
      } catch (err) {
        console.error("❌ Error fetching proposals:", err);
        setError("Failed to load proposals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user]);

  const handleAction = async (proposalId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please login again.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/proposals/${proposalId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // instantly update UI
      setProposals((prev) =>
        prev.map((p) =>
          p._id === proposalId ? { ...p, status: action } : p
        )
      );

      alert(`Proposal ${action} successfully ✅`);
    } catch (err) {
      console.error(`❌ Failed to ${action} proposal:`, err);
      alert(`Failed to ${action} proposal. Please try again.`);
    }
  };

  if (loading) return <p className="text-center mt-10">⏳ Loading proposals...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">📩 Author Proposals</h2>

      {proposals.length === 0 ? (
        <p>No proposals submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-start"
            >
              <div>
                <h3 className="text-lg font-semibold">{proposal.bookTitle}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  ✍️ Author: {proposal.authorName}
                </p>
                <p className="text-gray-800 mt-2">{proposal.proposalBody}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Status:{" "}
                  <b
                    className={
                      proposal.status === "accepted"
                        ? "text-green-600"
                        : proposal.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {proposal.status}
                  </b>
                </p>
              </div>

              {proposal.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(proposal._id, "accepted")}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(proposal._id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublisherProposals;
