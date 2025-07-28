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
  const data = {
    labels: [...historicalDates, ...futureDates],
    datasets: [
      {
        label: 'Historical Prices',
        data: [...historicalPrices, ...Array(futureDates.length).fill(null)],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 2
      },
      {
        label: 'Predicted Prices',
        data: [...Array(historicalDates.length).fill(null), ...predictedPrices],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0.1,
        pointRadius: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Stock Price Prediction'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-lg">
      <Line data={data} options={options} />
    </div>
  );
} 