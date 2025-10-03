/*import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // 👈 token stored on login
      const { data } = await axios.get("http://localhost:5000/api/auth/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update role
  const updateRole = async (id, role) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/auth/admin/users/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/auth/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Users</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="user">User</option>
                  <option value="author">Author</option>
                  <option value="publisher">Publisher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard; */


import React, { useState } from "react";
import ManageUsers from "./ManageUsers";
import ManageBooks from "./ManageBooks";
import ManageOrders from "./ManageOrders";
import Analytics from "./AdminAnalytics.jsx";
import "../AdminDashboard/admin.css";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6"> Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("users")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Manage Users
        </button>
        <button onClick={() => setActiveTab("books")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Manage Books
        </button>
        <button onClick={() => setActiveTab("orders")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Manage Orders
        </button>
        <button onClick={() => setActiveTab("analytics")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Analytics
        </button>
      </div>

      {/* Render Tab Content */}
      {activeTab === "users" && <ManageUsers />}
      {activeTab === "books" && <ManageBooks />}
      {activeTab === "orders" && <ManageOrders />}
      {activeTab === "analytics" && <Analytics />}
    </div>
  );
};

export default AdminDashboard;
