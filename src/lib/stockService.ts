const api_key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY as string;

// Check if API key is available - be more strict for production
const isApiAvailable = api_key && 
  api_key !== 'your_finnhub_api_key_here' && 
  api_key !== 'undefined' && 
  api_key.length > 20; // Require longer key for real API

console.log('API Key available:', !!api_key);
console.log('API Key length:', api_key?.length || 0);
console.log('Is API available:', isApiAvailable);

if (!isApiAvailable) {
  console.error('❌ FINNHUB API KEY NOT CONFIGURED!');
  console.error('📝 To get real stock data:');
  console.error('1. Go to https://finnhub.io/');
  console.error('2. Sign up for a free account');
  console.error('3. Get your API key from the dashboard');
  console.error('4. Create .env.local file in project root');
  console.error('5. Add: NEXT_PUBLIC_FINNHUB_API_KEY=your_actual_key');
  console.error('6. Restart the development server');
}

// Enhanced sample data for testing when API is not available
const sampleStockData = {
  c: [150.25, 151.30, 152.45, 151.80, 153.20, 154.10, 153.90, 155.25, 156.40, 155.80, 157.20, 158.30, 157.90, 159.10, 160.25, 159.80, 161.40, 162.50, 161.90, 163.20, 164.30, 163.80, 165.10, 166.25, 165.90, 167.40, 168.50, 167.90, 169.20, 170.30, 169.80, 171.10, 172.25, 171.90, 173.40, 174.50, 173.90, 175.20, 176.30, 175.80, 177.10, 178.25, 177.90, 179.40, 180.50, 179.90, 181.20, 182.30, 181.80, 183.10, 184.25, 183.90, 185.40, 186.50, 185.90, 187.20, 188.30, 187.80, 189.10, 190.25],
  h: [151.00, 152.00, 153.00, 152.50, 154.00, 155.00, 154.50, 156.00, 157.00, 156.50, 158.00, 159.00, 158.50, 160.00, 161.00, 160.50, 162.00, 163.00, 162.50, 164.00, 165.00, 164.50, 166.00, 167.00, 166.50, 168.00, 169.00, 168.50, 170.00, 171.00, 170.50, 172.00, 173.00, 172.50, 174.00, 175.00, 174.50, 176.00, 177.00, 176.50, 178.00, 179.00, 178.50, 180.00, 181.00, 180.50, 182.00, 183.00, 182.50, 184.00, 185.00, 184.50, 186.00, 187.00, 186.50, 188.00, 189.00, 188.50, 190.00, 191.00],
  l: [149.50, 150.50, 151.50, 150.80, 152.50, 153.50, 152.90, 154.50, 155.50, 154.90, 156.50, 157.50, 156.90, 158.50, 159.50, 158.90, 160.50, 161.50, 160.90, 162.50, 163.50, 162.90, 164.50, 165.50, 164.90, 166.50, 167.50, 166.90, 168.50, 169.50, 168.90, 170.50, 171.50, 170.90, 172.50, 173.50, 172.90, 174.50, 175.50, 174.90, 176.50, 177.50, 176.90, 178.50, 179.50, 178.90, 180.50, 181.50, 180.90, 182.50, 183.50, 182.90, 184.50, 185.50, 184.90, 186.50, 187.50, 186.90, 188.50, 189.50],
  o: [150.00, 151.00, 152.00, 151.50, 153.00, 154.00, 153.50, 155.00, 156.00, 155.50, 157.00, 158.00, 157.50, 159.00, 160.00, 159.50, 161.00, 162.00, 161.50, 163.00, 164.00, 163.50, 165.00, 166.00, 165.50, 167.00, 168.00, 167.50, 169.00, 170.00, 169.50, 171.00, 172.00, 171.50, 173.00, 174.00, 173.50, 175.00, 176.00, 175.50, 177.00, 178.00, 177.50, 179.00, 180.00, 179.50, 181.00, 182.00, 181.50, 183.00, 184.00, 183.50, 185.00, 186.00, 185.50, 187.00, 188.00, 187.50, 189.00, 190.00],
  s: 'ok',
  t: Array.from({length: 60}, (_, i) => Math.floor(Date.now() / 1000) - (60 - i) * 24 * 60 * 60),
  v: Array.from({length: 60}, () => Math.floor(Math.random() * 1000000) + 500000)
};

export interface StockData {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string;   // Status
  t: number[]; // Timestamps
  v: number[]; // Volume
}

export interface StockQuote {
  c: number;  // Current price
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

// Helper function to create timeout promise
function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), ms)
    )
  ]);
}

export async function getHistoricalData(symbol: string, from?: number, to?: number): Promise<StockData> {
  if (!isApiAvailable) {
    console.error('❌ NO API KEY CONFIGURED - CANNOT FETCH REAL DATA');
    console.error('📝 Please set up your Finnhub API key to get real stock data');
    throw new Error('API key not configured. Please set up Finnhub API key to get real stock data.');
  }

  try {
    console.log('🔍 Fetching real historical data for:', symbol);
    
    // Use current timestamp if not provided
    const toTime = to || Math.floor(Date.now() / 1000);
    const fromTime = from || (toTime - (60 * 24 * 60 * 60)); // 60 days ago
    
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${fromTime}&to=${toTime}&token=${api_key}`;
    
    console.log('🌐 Making API call to Finnhub...');
    
    const response = await timeoutPromise(
      fetch(url),
      15000 // 15 second timeout for real API
    );
    
    if (!response.ok) {
      if (response.status === 403) {
        console.error('❌ API KEY INVALID OR RATE LIMIT EXCEEDED');
        console.error('📝 Please check your API key or wait for rate limit to reset');
        throw new Error('API key invalid or rate limit exceeded. Please check your Finnhub API key.');
      }
      console.error(`❌ API ERROR: HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`API error: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Real API data received:', data);
    
    if (data.s === 'ok' && data.c && data.c.length >= 50) {
      console.log('✅ Successfully loaded real stock data');
      return data;
    } else if (data.s === 'no_data') {
      console.error('❌ No historical data available for this symbol');
      throw new Error('No historical data available for this symbol. Please try a different stock.');
    } else {
      console.error('❌ Invalid API response format');
      throw new Error('Invalid API response format. Please try again.');
    }
    
  } catch (error) {
    console.error('❌ Error fetching real historical data:', error);
    throw error; // Re-throw to let the UI handle it
  }
}

// Helper function to create simulated data
function createSimulatedData(basePrice: number): StockData {
  const prices = Array.from({length: 60}, (_, i) => {
    const variation = (Math.random() - 0.5) * (basePrice * 0.05); // 5% variation
    return Math.max(basePrice + variation, basePrice * 0.9);
  });
  
  const timestamps = Array.from({length: 60}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (60 - i));
    return Math.floor(date.getTime() / 1000);
  });
  
  return {
    c: prices,
    h: prices.map(p => p * 1.02),
    l: prices.map(p => p * 0.98),
    o: prices.map(p => p * 1.01),
    s: 'ok',
    t: timestamps,
    v: Array.from({length: 60}, () => Math.floor(Math.random() * 1000000) + 500000)
  };
}

export async function getCurrentPrice(symbol: string): Promise<StockQuote> {
  try {
    if (!isApiAvailable) {
      console.warn('Finnhub API not available, returning sample data.');
      return {
        c: 150.00,
        h: 151.00,
        l: 149.50,
        o: 150.00,
        pc: 149.00,
        t: Math.floor(Date.now() / 1000)
      };
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${api_key}`;
    
    const response = await timeoutPromise(
      fetch(url),
      5000 // 5 second timeout
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching current price:', error);
    throw error;
  }
}

export async function searchSymbol(query: string) {
  console.log('🔍 Searching for real stock data:', query);
  
  if (!isApiAvailable) {
    console.error('❌ NO API KEY CONFIGURED - CANNOT SEARCH REAL STOCKS');
    console.error('📝 Please set up your Finnhub API key to search real stocks');
    throw new Error('API key not configured. Please set up Finnhub API key to search real stocks.');
  }

  try {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${api_key}`;
    
    console.log('🌐 Making API call to Finnhub search...');
    
    const response = await timeoutPromise(
      fetch(url),
      10000 // 10 second timeout for search
    );
    
    if (!response.ok) {
      if (response.status === 403) {
        console.error('❌ API KEY INVALID OR RATE LIMIT EXCEEDED');
        throw new Error('API key invalid or rate limit exceeded. Please check your Finnhub API key.');
      }
      console.error(`❌ SEARCH API ERROR: HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`Search API error: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Real search results received:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error searching real stocks:', error);
    throw error; // Re-throw to let the UI handle it
  }
}

// Helper function to get Unix timestamp for n days ago
export function getUnixTime(daysAgo: number = 30): number {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return Math.floor(date.getTime() / 1000);
}

// Format timestamp to date string
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
} 