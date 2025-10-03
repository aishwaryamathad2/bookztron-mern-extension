//anasalesinsights
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AuthorDashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AnaSalesInsights() {
  const data = {
    labels: [
      "Twisted Love",
      "Twisted Hate",
      "Twisted Lies",
      "King of Wrath",
      "King of Envy",
      "King of Sloth",
    ],
    datasets: [
      {
        label: "Sales (in 1000s)",
        data: [120, 95, 140, 160, 110, 90],
        backgroundColor: [
          "#b48de0",
          "#c8a2f0",
          "#d9b3ff",
          "#e6ccff",
          "#d8bfd8",
          "#c6a4de",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#5c3c92" } },
      title: {
        display: true,
        text: "Ana’s Book Sales Insights",
        color: "#5c3c92",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#5c3c92" },
        grid: { color: "#eee" },
      },
      y: {
        ticks: { color: "#5c3c92" },
        grid: { color: "#eee" },
      },
    },
  };

  return (
    <div className="section-container wide-section">
      <h2 className="section-title">Sales Insights</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default AnaSalesInsights;
