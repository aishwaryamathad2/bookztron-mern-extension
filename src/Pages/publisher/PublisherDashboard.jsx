// src/Pages/Publisher/PublisherDashboard.jsx
import React, { useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./publisher.css"; // your styles

const PublisherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "publisher") {
      navigate("/");
      return;
    }
    if (location.pathname === "/publisher/dashboard") {
      navigate("/publisher/dashboard/books");
    }
  }, [user, navigate, location.pathname]);

  return (
    <div className="publisher-dashboard min-h-screen bg-gray-50 p-6">
      <div className="md:flex md:space-x-6">
        <aside className="w-full md:w-64 bg-white rounded-lg shadow p-4 mb-6 md:mb-0">
          <h2 className="text-lg font-bold mb-4 text-center">{user?.name || "Publisher"}</h2>
          <ul className="space-y-2">
            <li>
              <NavLink to="books" className={({ isActive }) => `p-2 block rounded ${isActive ? "bg-purple-100 font-semibold" : ""}`}>📚 Books</NavLink>
            </li>
            <li>
              <NavLink to="profile" className={({ isActive }) => `p-2 block rounded ${isActive ? "bg-purple-100 font-semibold" : ""}`}>👤 Profile</NavLink>
            </li>
            <li>
              <NavLink to="proposals" className={({ isActive }) => `p-2 block rounded ${isActive ? "bg-purple-100 font-semibold" : ""}`}>📩 Proposals</NavLink>
            </li>
            <li>
              <NavLink to="insights" className={({ isActive }) => `p-2 block rounded ${isActive ? "bg-purple-100 font-semibold" : ""}`}>📊 Insights</NavLink>
            </li>
          </ul>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PublisherDashboard;
