//anadashboard
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AnaProfile from "./AnaProfile";
import AnaProposals from "./AnaProposals";
import AnaBooksList from "./AnaBooksList";
import AnaSalesInsights from "./AnaSalesInsights";

function AnaDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          <li><Link to="profile">Profile</Link></li>
          <li><Link to="proposals">Proposals</Link></li>
          <li><Link to="book-list">My Books</Link></li>
          <li><Link to="sales-insights">Sales Insights</Link></li>
          <li><Link to="/author/addbook">Add New Book</Link></li>

        </ul>
      </aside>
<main className="dashboard-content">
  <Routes>
    <Route path="profile" element={<AnaProfile />} />
    <Route path="proposals" element={<AnaProposals />} />
    <Route path="book-list" element={<AnaBooksList />} />
    <Route path="sales-insights" element={<AnaSalesInsights />} />
  </Routes>
</main>

    </div>
  );
}

export default AnaDashboard;
