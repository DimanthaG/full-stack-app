'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { prepareTrainingData, trainNetwork, predictNextDays } from '@/lib/stockPredictor';
import StockChart from '@/components/StockChart';
import { getHistoricalData, searchSymbol, formatDate } from '@/lib/stockService';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { FaUpload, FaSearch, FaBrain } from 'react-icons/fa';

interface StockData {
  dates: string[];
  prices: number[];
}

export default function StockPredictionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [futureDates, setFutureDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [daysToPredict, setDaysToPredict] = useState(7);
  const [dataSource, setDataSource] = useState<'api' | 'file'>('api');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </PageTransition>
    );
  }

  if (!session) {
    return null;
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const results = await searchSymbol(searchTerm);
      console.log('Search results received:', results);
      console.log('Results array:', results.result);
      setSearchResults(results.result || []);
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error searching for stocks.';
      
      if (errorMessage.includes('API key not configured')) {
        alert('❌ API Key Not Configured!\n\n📝 To get real stock data:\n1. Go to https://finnhub.io/\n2. Sign up for a free account\n3. Get your API key\n4. Create .env.local file\n5. Add: NEXT_PUBLIC_FINNHUB_API_KEY=your_key\n6. Restart the server');
      } else if (errorMessage.includes('rate limit')) {
        alert('⚠️ Rate limit exceeded. Please wait a moment and try again.');
      } else {
        alert(`Error searching for stocks: ${errorMessage}`);
      }
    }
  };

  const handleSymbolSelect = async (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchResults([]);
    setSearchTerm(symbol);

    try {
      const apiData = await getHistoricalData(symbol);
      
      // Convert API data format to expected format
      if (apiData && apiData.c && apiData.t) {
        const dates = apiData.t.map(timestamp => formatDate(timestamp));
        const prices = apiData.c; // Use close prices
        
        setStockData({
          dates,
          prices
        });
        console.log('✅ Real stock data loaded:', { dates: dates.length, prices: prices.length });
      } else {
        console.error('Invalid data format received');
        alert('Error: Invalid data format received');
      }
    } catch (error) {
      console.error('Error loading stock data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error loading stock data.';
      
      if (errorMessage.includes('API key not configured')) {
        alert('❌ API Key Not Configured!\n\n📝 To get real stock data:\n1. Go to https://finnhub.io/\n2. Sign up for a free account\n3. Get your API key\n4. Create .env.local file\n5. Add: NEXT_PUBLIC_FINNHUB_API_KEY=your_key\n6. Restart the server');
      } else if (errorMessage.includes('rate limit')) {
        alert('⚠️ Rate limit exceeded. Please wait a moment and try again.');
      } else if (errorMessage.includes('No historical data')) {
        alert('⚠️ No historical data available for this symbol. Please try a different stock.');
      } else {
        alert(`Error loading stock data: ${errorMessage}`);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      parseCSVFile(file);
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('Invalid CSV file. Please ensure it has at least a header and one data row.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const dateIndex = headers.findIndex(h => h.includes('date'));
      const priceIndex = headers.findIndex(h => h.includes('price') || h.includes('close') || h.includes('value'));

      if (dateIndex === -1 || priceIndex === -1) {
        alert('CSV must contain Date and Price columns.');
        return;
      }

      const data: { date: string; price: number }[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const date = values[dateIndex]?.trim();
        const price = parseFloat(values[priceIndex]?.trim());

        if (date && !isNaN(price)) {
          data.push({ date, price });
        }
      }

      if (data.length < 50) {
        alert('Please provide at least 50 data points for accurate predictions.');
        return;
      }

      // Sort by date
      data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setStockData({
        dates: data.map(d => d.date),
        prices: data.map(d => d.price)
      });
    };
    reader.readAsText(file);
  };

  async function handlePredict() {
    if (!stockData) {
      alert('Please load stock data first');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare training data
      const trainingData = prepareTrainingData(stockData.prices);

      // Train the network
      const network = await trainNetwork(trainingData);

      // Make predictions
      const predictedPrices = predictNextDays(
        network,
        stockData.prices,
        daysToPredict
      );

      // Generate future dates
      const lastDate = new Date(stockData.dates[stockData.dates.length - 1]);
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
    <PageTransition>
      <div className="max-w-7xl mx-auto py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-white"
        >
          Stock Price Prediction
        </motion.h1>

        {/* Data Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-[#2A3B4C]/20 backdrop-blur-sm rounded-lg p-6 border border-[#4A5B6C]/30"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">Data Input</h2>

          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="api"
                  checked={dataSource === 'api'}
                  onChange={(e) => setDataSource(e.target.value as 'api' | 'file')}
                  className="mr-2"
                />
                <span className="text-white">Use API</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={dataSource === 'file'}
                  onChange={(e) => setDataSource(e.target.value as 'api' | 'file')}
                  className="mr-2"
                />
                <span className="text-white">Upload File</span>
              </label>
            </div>

            {dataSource === 'api' ? (
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Search for a stock symbol (e.g., AAPL, MSFT)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#4A5B6C]/50 border border-[#6A7B8C]/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-[#8A9B9C]"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-[#4A5B6C] hover:bg-[#6A7B8C] text-white rounded-lg transition-colors"
                  >
                    <FaSearch className="w-4 h-4" />
                  </button>
                </div>

                {searchResults.length > 0 && (
                  <div className="bg-[#4A5B6C]/30 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.symbol || result.displaySymbol || index}
                        onClick={() => handleSymbolSelect(result.symbol || result.displaySymbol || '')}
                        className="flex justify-between items-center p-2 hover:bg-[#6A7B8C]/30 rounded cursor-pointer text-white"
                      >
                        <span className="font-medium">{result.symbol || result.displaySymbol}</span>
                        <span className="text-gray-300">{result.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSymbol && (
                  <div className="mt-4 p-3 bg-[#4A5B6C]/30 rounded-lg">
                    <p className="text-white">
                      <span className="font-medium">Selected:</span> {selectedSymbol}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A5B6C] file:text-white hover:file:bg-[#6A7B8C] file:cursor-pointer"
                />
                <p className="text-sm text-gray-300 mt-2">
                  Upload a CSV file with Date and Price columns. At least 50 data points required.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Brain.js Model Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-[#2A3B4C]/20 backdrop-blur-sm rounded-lg p-6 border border-[#4A5B6C]/30"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">Brain.js Model</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="text-white">
              Days to Predict:
              <input
                type="number"
                min="1"
                max="30"
                value={daysToPredict}
                onChange={(e) => setDaysToPredict(parseInt(e.target.value))}
                className="ml-2 px-3 py-1 bg-[#4A5B6C]/50 border border-[#6A7B8C]/30 rounded text-white focus:outline-none focus:border-[#8A9B9C]"
              />
            </label>
            <button
              onClick={handlePredict}
              disabled={!stockData || isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-[#4A5B6C] hover:bg-[#6A7B8C] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <FaBrain className="w-4 h-4" />
              {isLoading ? 'Predicting...' : 'Predict'}
            </button>
          </div>

          {predictions.length > 0 && (
            <div className="bg-[#2A3B4C]/30 rounded-md p-4">
              <h3 className="text-white font-medium mb-2">Prediction Results:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {predictions.map((price, index) => (
                  <div key={index} className="text-center">
                    <p className="text-gray-300 text-sm">Day {index + 1}</p>
                    <p className="text-white font-medium">${price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Visualization */}
        {stockData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#2A3B4C]/20 backdrop-blur-sm rounded-lg p-6 border border-[#4A5B6C]/30"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Visualization</h2>
            <StockChart
              historicalDates={stockData.dates}
              historicalPrices={stockData.prices}
              predictedPrices={predictions}
              futureDates={futureDates}
            />
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
} 