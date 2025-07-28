const api_key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY as string;
const alpha_vantage_key = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY as string;

// Check if API keys are available - be more strict for production
const isFinnhubAvailable = api_key && 
  api_key !== 'your_finnhub_api_key_here' && 
  api_key !== 'undefined' && 
  api_key.length > 20;

const isAlphaVantageAvailable = alpha_vantage_key && 
  alpha_vantage_key !== 'your_alpha_vantage_api_key_here' && 
  alpha_vantage_key !== 'undefined' && 
  alpha_vantage_key.length > 10; // Reduced from 20 to 10 for Alpha Vantage

const isApiAvailable = isFinnhubAvailable || isAlphaVantageAvailable;

console.log('Finnhub API Key available:', !!api_key);
console.log('Alpha Vantage API Key available:', !!alpha_vantage_key);
console.log('Alpha Vantage key length:', alpha_vantage_key?.length || 0);
console.log('Alpha Vantage key value:', alpha_vantage_key ? `${alpha_vantage_key.substring(0, 4)}...` : 'undefined');
console.log('Is any API available:', isApiAvailable);

if (!isApiAvailable) {
  console.error('❌ NO API KEYS CONFIGURED!');
  console.error('📝 To get real stock data, configure at least one API:');
  console.error('1. Finnhub: https://finnhub.io/ (free tier)');
  console.error('2. Alpha Vantage: https://www.alphavantage.co/ (free tier)');
  console.error('3. Create .env.local file with:');
  console.error('   NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key');
  console.error('   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key');
  console.error('4. Restart the development server');
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

// Helper function to add delay between API calls
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Track API calls to prevent rate limiting
let apiCallCount = 0;
let lastApiCall = 0;

function checkRateLimit() {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  // Reset counter if more than 1 minute has passed
  if (timeSinceLastCall > 60000) {
    apiCallCount = 0;
  }
  
  // If we've made too many calls recently, add delay
  if (apiCallCount >= 50) { // Conservative limit
    const waitTime = 60000 - timeSinceLastCall;
    if (waitTime > 0) {
      console.log(`⏳ Rate limit approaching, waiting ${Math.ceil(waitTime/1000)}s...`);
      return delay(waitTime);
    }
  }
  
  apiCallCount++;
  lastApiCall = now;
  return Promise.resolve();
}

export async function getHistoricalData(symbol: string, from?: number, to?: number): Promise<StockData> {
  if (!isApiAvailable) {
    console.error('❌ NO API KEYS CONFIGURED - CANNOT FETCH REAL DATA');
    console.error('📝 Please set up at least one API key to get real stock data');
    throw new Error('API keys not configured. Please set up at least one API key to get real stock data.');
  }

  console.log('🔍 Starting historical data fetch for:', symbol);
  console.log('📊 Available APIs - Finnhub:', isFinnhubAvailable, 'Alpha Vantage:', isAlphaVantageAvailable);

  // Try Finnhub first, then Alpha Vantage as fallback
  if (isFinnhubAvailable) {
    try {
      await checkRateLimit();
      
      console.log('🔍 Fetching real historical data from Finnhub for:', symbol);
      
      // Use current timestamp if not provided
      const toTime = to || Math.floor(Date.now() / 1000);
      const fromTime = from || (toTime - (60 * 24 * 60 * 60)); // 60 days ago
      
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${fromTime}&to=${toTime}&token=${api_key}`;
      
      console.log('🌐 Making API call to Finnhub...');
      console.log('🔑 API Key length:', api_key?.length || 0);
      
      const response = await timeoutPromise(fetch(url), 15000);
      
      console.log('📡 Finnhub response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('⚠️ Finnhub 403 error - likely invalid API key or rate limit');
          console.warn('⚠️ Trying Alpha Vantage as fallback...');
          throw new Error('Finnhub 403 error');
        }
        throw new Error(`Finnhub API error: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Finnhub historical data received:', data);
      
      if (data.s === 'ok' && data.c && data.c.length >= 50) {
        console.log('✅ Successfully loaded real stock data from Finnhub');
        return data;
      } else if (data.s === 'no_data') {
        console.warn('⚠️ No data in Finnhub, trying Alpha Vantage...');
        throw new Error('No data in Finnhub');
      } else {
        console.warn('⚠️ Invalid Finnhub response, trying Alpha Vantage...');
        throw new Error('Invalid Finnhub response format');
      }
      
    } catch (error) {
      console.warn('⚠️ Finnhub failed:', error);
      console.warn('⚠️ Trying Alpha Vantage as fallback...');
    }
  }

  // Fallback to Alpha Vantage
  if (isAlphaVantageAvailable) {
    try {
      console.log('🔍 Fetching real historical data from Alpha Vantage for:', symbol);
      console.log('🔑 Alpha Vantage API Key length:', alpha_vantage_key?.length || 0);
      
      const data = await getHistoricalDataAlphaVantage(symbol);
      console.log('✅ Successfully loaded real stock data from Alpha Vantage');
      return data;
    } catch (error) {
      console.error('❌ Alpha Vantage also failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Both APIs failed. Finnhub: 403 error, Alpha Vantage: ${errorMessage}`);
    }
  }

  // Try Alpha Vantage even if not initially detected as available
  if (alpha_vantage_key && alpha_vantage_key.length > 5) {
    try {
      console.log('🔍 Trying Alpha Vantage as last resort for:', symbol);
      console.log('🔑 Alpha Vantage API Key length:', alpha_vantage_key?.length || 0);
      
      const data = await getHistoricalDataAlphaVantage(symbol);
      console.log('✅ Successfully loaded real stock data from Alpha Vantage (fallback)');
      return data;
    } catch (error) {
      console.error('❌ Alpha Vantage fallback also failed:', error);
    }
  }

  throw new Error('No working API available. Please check your API keys are valid.');
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
    console.error('❌ NO API KEYS CONFIGURED - CANNOT SEARCH REAL STOCKS');
    console.error('📝 Please set up at least one API key to search real stocks');
    throw new Error('API keys not configured. Please set up at least one API key to search real stocks.');
  }

  // Try Finnhub first, then Alpha Vantage as fallback
  if (isFinnhubAvailable) {
    try {
      await checkRateLimit();
      
      const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${api_key}`;
      
      console.log('🌐 Making API call to Finnhub search...');
      
      const response = await timeoutPromise(fetch(url), 10000);
      
      if (!response.ok) {
        if (response.status === 403) {
          console.warn('⚠️ Finnhub rate limit, trying Alpha Vantage...');
          throw new Error('Finnhub rate limit');
        }
        throw new Error(`Finnhub API error: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Finnhub search results received:', data);
      
      // Limit results to 3 to save API calls
      if (data.result && Array.isArray(data.result)) {
        data.result = data.result.slice(0, 3);
        data.count = Math.min(data.count, 3);
        console.log('📊 Limited search results to 3 to save API calls');
      }
      
      return data;
      
    } catch (error) {
      console.warn('⚠️ Finnhub failed, trying Alpha Vantage...');
    }
  }

  // Fallback to Alpha Vantage
  if (isAlphaVantageAvailable) {
    try {
      console.log('🌐 Making API call to Alpha Vantage search...');
      const data = await searchSymbolAlphaVantage(query);
      console.log('✅ Alpha Vantage search results received:', data);
      return data;
    } catch (error) {
      console.error('❌ Alpha Vantage also failed:', error);
      throw new Error('Both APIs failed. Please check your API keys or try again later.');
    }
  }

  throw new Error('No working API available. Please configure at least one API key.');
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

// Alpha Vantage API functions
async function searchSymbolAlphaVantage(query: string) {
  if (!isAlphaVantageAvailable) {
    throw new Error('Alpha Vantage API not configured');
  }

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${alpha_vantage_key}`;
  
  const response = await timeoutPromise(fetch(url), 10000);
  
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }
  
  // Convert Alpha Vantage format to match Finnhub format
  const results = data.bestMatches?.slice(0, 3) || [];
  return {
    count: results.length,
    result: results.map((item: any) => ({
      symbol: item['1. symbol'],
      displaySymbol: item['1. symbol'],
      description: item['2. name']
    }))
  };
}

async function getHistoricalDataAlphaVantage(symbol: string): Promise<StockData> {
  if (!isAlphaVantageAvailable) {
    throw new Error('Alpha Vantage API not configured');
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${alpha_vantage_key}`;
  
  console.log('🌐 Making API call to Alpha Vantage...');
  console.log('📡 Alpha Vantage URL:', url.split('?')[0]);
  
  const response = await timeoutPromise(fetch(url), 15000);
  
  console.log('📡 Alpha Vantage response status:', response.status);
  
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: HTTP ${response.status}`);
  }
  
  const data = await response.json();
  console.log('📊 Alpha Vantage response keys:', Object.keys(data));
  
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }
  
  if (data['Note']) {
    throw new Error(`Alpha Vantage rate limit: ${data['Note']}`);
  }
  
  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    throw new Error('No historical data available for this symbol');
  }
  
  // Convert Alpha Vantage format to match Finnhub format
  const dates = Object.keys(timeSeries).sort().slice(-60); // Last 60 days
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));
  const timestamps = dates.map(date => Math.floor(new Date(date).getTime() / 1000));
  
  console.log('✅ Alpha Vantage data processed:', { dates: dates.length, prices: prices.length });
  
  return {
    c: prices, // Close prices
    h: dates.map(date => parseFloat(timeSeries[date]['2. high'])),
    l: dates.map(date => parseFloat(timeSeries[date]['3. low'])),
    o: dates.map(date => parseFloat(timeSeries[date]['1. open'])),
    s: 'ok',
    t: timestamps,
    v: dates.map(date => parseInt(timeSeries[date]['5. volume']))
  };
} 

// Test function to verify API keys
export async function testApiKeys() {
  console.log('🧪 Testing API keys...');
  
  if (isFinnhubAvailable) {
    try {
      console.log('🔍 Testing Finnhub API key...');
      const url = `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${api_key}`;
      const response = await fetch(url);
      console.log('📡 Finnhub test response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Finnhub API key is working!');
        return { finnhub: 'working' };
      } else {
        console.log('❌ Finnhub API key test failed:', response.status);
        return { finnhub: 'failed', status: response.status };
      }
    } catch (error) {
      console.log('❌ Finnhub API key test error:', error);
      return { finnhub: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  if (isAlphaVantageAvailable) {
    try {
      console.log('🔍 Testing Alpha Vantage API key...');
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${alpha_vantage_key}`;
      const response = await fetch(url);
      console.log('📡 Alpha Vantage test response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data['Error Message']) {
          console.log('❌ Alpha Vantage API key test failed:', data['Error Message']);
          return { alphaVantage: 'failed', error: data['Error Message'] };
        } else {
          console.log('✅ Alpha Vantage API key is working!');
          return { alphaVantage: 'working' };
        }
      } else {
        console.log('❌ Alpha Vantage API key test failed:', response.status);
        return { alphaVantage: 'failed', status: response.status };
      }
    } catch (error) {
      console.log('❌ Alpha Vantage API key test error:', error);
      return { alphaVantage: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  return { error: 'No API keys configured' };
} 

// Simple API key verification
export async function verifyApiKeys() {
  console.log('🔍 Verifying API keys...');
  
  const results = {
    finnhub: { available: false, working: false, error: null as string | null },
    alphaVantage: { available: false, working: false, error: null as string | null }
  };

  // Test Finnhub
  if (isFinnhubAvailable) {
    results.finnhub.available = true;
    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${api_key}`);
      results.finnhub.working = response.ok;
      if (!response.ok) {
        results.finnhub.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      results.finnhub.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  // Test Alpha Vantage
  if (alpha_vantage_key && alpha_vantage_key.length > 5) {
    results.alphaVantage.available = true;
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${alpha_vantage_key}`);
      if (response.ok) {
        const data = await response.json();
        results.alphaVantage.working = !data['Error Message'];
        if (data['Error Message']) {
          results.alphaVantage.error = data['Error Message'];
        }
      } else {
        results.alphaVantage.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      results.alphaVantage.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  console.log('📊 API Key Verification Results:', results);
  return results;
} 