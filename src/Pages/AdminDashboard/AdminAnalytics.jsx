import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/orders/admin/analytics",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const raw = res.data.salesByCategoryPerMonth;

        // Category list we want to always show
        const categories = [
          "Romance",
          "Fiction",
          "Manga",
          "Philosophy",
          "Tech",
          "Thriller",
        ];

        // Month names (1 → Jan, etc.)
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Pre-fill months with all categories = 0
        const months = {};
        monthNames.forEach((m, idx) => {
          months[idx + 1] = { month: m };
          categories.forEach((cat) => (months[idx + 1][cat] = 0));
        });

        // Insert real sales data
        raw.forEach((entry) => {
          const month = entry._id.month; // numeric month
          const category =
            entry._id.category?.charAt(0).toUpperCase() +
            entry._id.category?.slice(1).toLowerCase();

          if (categories.includes(category)) {
            months[month][category] = entry.totalSales;
          }
        });

        setData(Object.values(months));
      } catch (err) {
        console.error("❌ Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        📊 Sales Analytics (Monthly by Category)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Romance" fill="#f87171" />
          <Bar dataKey="Fiction" fill="#f472b6" />
          <Bar dataKey="Manga" fill="#60a5fa" />
          <Bar dataKey="Philosophy" fill="#a78bfa" />
          <Bar dataKey="Tech" fill="#34d399" />
          <Bar dataKey="Thriller" fill="#fbbf24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminAnalytics;
