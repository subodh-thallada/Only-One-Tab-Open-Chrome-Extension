import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Charts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data for charts:", data);
        setData(data);
      })
      .catch((error) => console.error("Error fetching data for charts:", error));
  }, []);

  if (!data || data.length === 0) {
    return <p>Loading or no data available for charts...</p>;
  }

  // Prepare data for the chart
  const feature1Data = data.map((row) => row.Feature_1 || 0); // Replace 'Feature_1' with actual column name
  const feature2Data = data.map((row) => row.Feature_2 || 0); // Replace 'Feature_2' with actual column name

  const chartData = {
    labels: data.map((_, i) => `Row ${i + 1}`),
    datasets: [
      {
        label: "Feature 1",
        data: feature1Data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Feature 2",
        data: feature2Data,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Feature Comparison",
      },
    },
  };

  return (
    <div>
      <h2>Data Charts</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Charts;
