import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StockChartProps {
  historicalDates: string[];
  historicalPrices: number[];
  predictedPrices?: number[];
  futureDates?: string[];
}

export default function StockChart({
  historicalDates,
  historicalPrices,
  predictedPrices = [],
  futureDates = []
}: StockChartProps) {
  // Ensure arrays are properly initialized
  const safeHistoricalDates = Array.isArray(historicalDates) ? historicalDates : [];
  const safeHistoricalPrices = Array.isArray(historicalPrices) ? historicalPrices : [];
  const safePredictedPrices = Array.isArray(predictedPrices) ? predictedPrices : [];
  const safeFutureDates = Array.isArray(futureDates) ? futureDates : [];

  const data = {
    labels: [...safeHistoricalDates, ...safeFutureDates],
    datasets: [
      {
        label: 'Historical Prices',
        data: [...safeHistoricalPrices, ...Array(safeFutureDates.length).fill(null)],
        borderColor: '#8A9B9C',
        backgroundColor: 'rgba(138, 155, 156, 0.1)',
        tension: 0.1,
        pointRadius: 3,
        pointBackgroundColor: '#8A9B9C',
        pointBorderColor: '#4A5B6C',
        pointBorderWidth: 2
      },
      {
        label: 'Predicted Prices',
        data: [...Array(safeHistoricalDates.length).fill(null), ...safePredictedPrices],
        borderColor: '#6A7B8C',
        backgroundColor: 'rgba(106, 123, 140, 0.1)',
        borderDash: [5, 5],
        tension: 0.1,
        pointRadius: 3,
        pointBackgroundColor: '#6A7B8C',
        pointBorderColor: '#4A5B6C',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: 'bold' as const
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Stock Price Prediction',
        color: '#FFFFFF',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(42, 59, 76, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#4A5B6C',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(74, 91, 108, 0.3)',
          borderColor: 'rgba(74, 91, 108, 0.5)'
        },
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Price ($)',
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(74, 91, 108, 0.3)',
          borderColor: 'rgba(74, 91, 108, 0.5)'
        },
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Date',
          color: '#FFFFFF',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="w-full h-[400px] bg-[#2A3B4C]/20 backdrop-blur-sm p-6 rounded-lg border border-[#4A5B6C]/30">
      <Line data={data} options={options} />
    </div>
  );
} 