'use client';

import { useState, useEffect } from 'react';
import StockChart from '@/components/StockChart';
import {
  sampleStockData,
  prepareTrainingData,
  trainNetwork,
  predictNextDays
} from '@/lib/stockPredictor';

export default function StockPredictionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [futureDates, setFutureDates] = useState<string[]>([]);
  const [daysToPredict, setDaysToPredict] = useState(7);

  async function handlePredict() {
    setIsLoading(true);
    try {
      // Prepare training data
      const trainingData = prepareTrainingData(sampleStockData.prices);
      
      // Train the network
      const network = await trainNetwork(trainingData);
      
      // Make predictions
      const predictedPrices = predictNextDays(
        network,
        sampleStockData.prices,
        daysToPredict
      );
      
      // Generate future dates
      const lastDate = new Date(sampleStockData.dates[sampleStockData.dates.length - 1]);
      const newFutureDates = Array.from({ length: daysToPredict }, (_, i) => {
        const date = new Date(lastDate);
        date.setDate(date.getDate() + i + 1);
        return date.toISOString().split('T')[0];
      });

      setPredictions(predictedPrices);
      setFutureDates(newFutureDates);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error making prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Stock Price Prediction</h1>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-2">
          Days to Predict
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            min="1"
            max="30"
            value={daysToPredict}
            onChange={(e) => setDaysToPredict(Number(e.target.value))}
            className="mt-1 block w-32 rounded-md border-[#4A5B6C] shadow-sm focus:border-[#DAA520] focus:ring-[#DAA520] sm:text-sm bg-[#2A3B4C]/50 text-white placeholder-gray-400"
          />
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#DAA520] hover:bg-[#DAA520]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DAA520] disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Training...' : 'Predict'}
          </button>
        </div>
      </div>

      <div className="bg-[#2A3B4C]/20 backdrop-blur-sm rounded-lg shadow p-6 border border-[#4A5B6C]/30">
        <StockChart
          historicalDates={sampleStockData.dates}
          historicalPrices={sampleStockData.prices}
          predictedPrices={predictions}
          futureDates={futureDates}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">About This Predictor</h2>
        <p className="text-gray-200">
          This stock price predictor uses a neural network powered by Brain.js to analyze historical
          price patterns and make predictions about future prices. The model is trained on the
          last 50 days of historical data and can predict up to 30 days into the future.
          Please note that this is a demonstration and should not be used for actual trading decisions.
        </p>
      </div>
    </div>
  );
} 