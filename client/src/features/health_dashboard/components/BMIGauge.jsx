import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const BMIGauge = ({ bmi }) => {
  // BMI ranges and colors
  const bmiRanges = [
    { min: 0, max: 18.5, color: 'rgba(59, 130, 246, 0.8)', label: 'Underweight' },
    { min: 18.5, max: 25, color: 'rgba(34, 197, 94, 0.8)', label: 'Normal' },
    { min: 25, max: 30, color: 'rgba(251, 191, 36, 0.8)', label: 'Overweight' },
    { min: 30, max: 50, color: 'rgba(239, 68, 68, 0.8)', label: 'Obese' },
  ];

  // Calculate BMI position
  const calculateBMIPosition = (bmiValue) => {
    const clampedBMI = Math.max(0, Math.min(50, bmiValue));
    return (clampedBMI / 50) * 100;
  };

  // Create gauge data
  const createGaugeData = () => {
    const bmiPosition = calculateBMIPosition(bmi);
    
    // Background segments
    const backgroundData = bmiRanges.map(range => ({
      value: (range.max - range.min) / 50 * 100,
      color: range.color,
    }));

    // BMI indicator (thin line)
    const indicatorData = [
      bmiPosition - 0.5, // Small gap before indicator
      1, // Thin indicator line
      100 - bmiPosition - 0.5, // Rest of the gauge
    ];

    return {
      datasets: [
        // Background gauge
        {
          data: backgroundData.map(d => d.value),
          backgroundColor: backgroundData.map(d => d.color),
          borderColor: backgroundData.map(d => d.color.replace('0.8', '1')),
          borderWidth: 2,
        },
        // BMI indicator
        {
          data: indicatorData,
          backgroundColor: ['transparent', 'rgba(0, 0, 0, 0.8)', 'transparent'],
          borderColor: ['transparent', 'rgba(0, 0, 0, 1)', 'transparent'],
          borderWidth: [0, 3, 0],
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    rotation: -90,
    circumference: 180,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: false,
    },
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="relative w-full h-48">
      {/* Gauge Chart */}
      <div className="absolute inset-0">
        <Doughnut data={createGaugeData()} options={options} />
      </div>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
        <div className="text-3xl font-bold text-gray-900">
          {bmi?.toFixed(1) || '0.0'}
        </div>
        <div className={`text-sm font-medium ${bmiCategory.color}`}>
          {bmiCategory.category}
        </div>
      </div>

      {/* BMI Scale Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
        <span>0</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>50</span>
      </div>
    </div>
  );
};

export default BMIGauge;
