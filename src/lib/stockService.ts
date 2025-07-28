import finnhub from 'finnhub';

const api_key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY as string;
const finnhubClient = new finnhub.DefaultApi({
  apiKey: api_key,
  isJsonMime: (mime: string) => mime === 'application/json'
});

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

export async function getHistoricalData(symbol: string, from: number, to: number): Promise<StockData> {
  try {
    const response = await new Promise((resolve, reject) => {
      finnhubClient.stockCandles(symbol, 'D', from, to, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
    
    return response as StockData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

export async function getCurrentPrice(symbol: string): Promise<StockQuote> {
  try {
    const response = await new Promise((resolve, reject) => {
      finnhubClient.quote(symbol, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
    
    return response as StockQuote;
  } catch (error) {
    console.error('Error fetching current price:', error);
    throw error;
  }
}

export async function searchSymbol(query: string) {
  try {
    const response = await new Promise((resolve, reject) => {
      finnhubClient.symbolSearch(query, (error: any, data: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
    
    return response;
  } catch (error) {
    console.error('Error searching symbol:', error);
    throw error;
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