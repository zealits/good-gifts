import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./AdminDashboard.css";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalGiftCards, setTotalGiftCards] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesData, setSalesData] = useState({ labels: [], data: [] }); // To store sales data for the chart
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const [giftCardResponse, soldResponse, revenueResponse, salesResponse] = await Promise.all([
          axios.get("/api/v1/admin/list"),
          axios.get("/api/v1/admin/total-sold"),
          axios.get("/api/v1/admin/total-revenue"),
          axios.get("/api/v1/admin/sales-data"),
        ]);

        setTotalGiftCards(giftCardResponse.data.giftCardCount);
        setTotalSold(soldResponse.data.totalSold);
        setTotalRevenue(revenueResponse.data.totalRevenue);
        setSalesData(salesResponse.data.salesdata);

        const labels = salesResponse.data.map((item) => item.date);
        const sales = salesResponse.data.map((item) => item.sales);
        setSalesData({ labels, data: sales });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is done
      }
    };

    fetchData();
  }, []);

  // Line chart data and options for gift card sales
  const chartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: "Gift Cards Sold",
        data: salesData.data,
        borderColor: "rgb(255, 255, 255)",
        fill: true,
        tension: 0.3, // Smooth curves
        pointRadius: 6, // Slightly larger points for better visibility
        pointBackgroundColor: "rgb(255, 255, 255)", // Point color matching the line
        borderWidth: 3, // Thicker line
        hoverBorderWidth: 4, // Border width on hover for points
        hoverBackgroundColor: "rgba(0, 0, 0, 0.6)", // Highlight color for hover
        // Apply gradient effect for filling
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return; // if chart isn't rendered yet
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(6, 6, 6, 0.2)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.05)");
          return gradient;
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "rgba(0, 0, 0, 0.6)",
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)", // Lighter grid lines for the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales",
          color: "rgba(0, 0, 0, 0.6)",
        },
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)", // Lighter grid lines for the y-axis
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker background for tooltips
        titleColor: "#fff", // White color for tooltip title
        bodyColor: "#fff", // White color for tooltip body text
        borderColor: "rgb(0, 0, 0)", // Border color matching the line
        borderWidth: 2, // Tooltip border width
        padding: 10,
        displayColors: false, // Hide color box in tooltip
      },
      legend: {
        position: "top",
        labels: {
          fontColor: "rgba(0, 0, 0, 0.7)", // Legend font color
          fontSize: 14, // Increase font size for readability
        },
      },
    },
    interaction: {
      mode: "nearest", // Nearest point hover effect
      intersect: false, // Allow hover over lines to highlight data points
    },
    elements: {
      line: {
        borderWidth: 3, // Line thickness
        borderColor: "rgb(0, 0, 0)", // Line color
        tension: 0.3, // Smooth line
      },
      point: {
        radius: 6, // Point size
        hitRadius: 10, // Area for hover detection
        backgroundColor: "rgb(0, 0, 0)", // Point color matching the line
      },
    },
    animation: {
      duration: 1500, // Animation duration (slow for smooth effects)
      easing: "easeInOutCubic", // Smooth easing effect
    },
  };

  return (
    <div>
      <h1 className="heading">Dashboard</h1>
      <div className="dashboard-container">
        <div
          className="stat-card"
          onClick={() => navigate("/giftcards")} // Navigate to GiftCards page on click
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          <h3>Types Of Gift Card</h3>
          {loading ? <div className="skeleton" /> : <p>{totalGiftCards}</p>}
        </div>

        <div
          className="stat-card"
          onClick={() => navigate("/orders")} // Navigate to Orders page on click
          style={{ cursor: "pointer" }} // Make it look clickable
        >
          <h3>Total Gift Cards Sold</h3>
          {loading ? <div className="skeleton" /> : <p>{totalSold}</p>}
        </div>

        <div className="stat-card">
          <h3>Total Redemption </h3>
          {loading ? <div className="skeleton" /> : <p>${totalRevenue.toFixed(2)}</p>}
        </div>
      </div>

      <div className="graphs-section">
        <h3>Gift Card Sales (Last 30 Days)</h3>
        {loading ? <div className="skeleton-graph" /> : <Line data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
