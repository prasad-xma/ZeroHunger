import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const HealthMetricsChart = ({ data, type = 'macro' }) => {
  if (type === 'macro') {
    const chartData = {
      labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'],
      datasets: [
        {
          data: [data.protein || 0, data.carbs || 0, data.fat || 0],
          backgroundColor: [
            'rgba(251, 146, 60, 0.8)',  // Orange
            'rgba(251, 191, 36, 0.8)',  // Amber
            'rgba(254, 215, 170, 0.8)', // Light Orange
          ],
          borderColor: [
            'rgba(251, 146, 60, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(254, 215, 170, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value}g (${percentage}%)`;
            },
          },
        },
      },
      cutout: '60%',
    };

    return (
      <div className="w-full h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    );
  }

  if (type === 'progress') {
    const chartData = {
      labels: data.labels || [],
      datasets: [
        {
          label: 'Weight Progress',
          data: data.weight || [],
          borderColor: 'rgba(251, 146, 60, 1)',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Target Weight',
          data: data.targetWeight || [],
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Weight (kg)',
          },
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
    };

    return (
      <div className="w-full h-64">
        <Line data={chartData} options={options} />
      </div>
    );
  }

  return null;
};

export default HealthMetricsChart;
