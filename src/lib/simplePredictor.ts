// Simple stock predictor without GPU dependencies
export interface TrainingData {
  input: number[];
  output: number[];
}

export function prepareTrainingData(prices: number[]): TrainingData[] {
  const trainingData: TrainingData[] = [];
  
  // Use last 10 prices to predict next price
  const lookback = 10;
  
  for (let i = lookback; i < prices.length - 1; i++) {
    const input = prices.slice(i - lookback, i).map(p => p / 1000); // Normalize
    const output = [prices[i] / 1000]; // Normalize
    trainingData.push({ input, output });
  }
  
  return trainingData;
}

export function simplePredict(prices: number[], daysToPredict: number): number[] {
  const predictions: number[] = [];
  const lookback = 10;
  
  // Simple moving average with trend
  const recentPrices = prices.slice(-lookback);
  const avgPrice = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
  
  // Calculate trend
  const firstHalf = recentPrices.slice(0, lookback / 2);
  const secondHalf = recentPrices.slice(lookback / 2);
  const firstAvg = firstHalf.reduce((sum, price) => sum + price, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, price) => sum + price, 0) / secondHalf.length;
  const trend = (secondAvg - firstAvg) / firstAvg;
  
  // Predict future prices
  let currentPrice = avgPrice;
  for (let i = 0; i < daysToPredict; i++) {
    currentPrice = currentPrice * (1 + trend * 0.1); // Apply trend with dampening
    predictions.push(currentPrice);
  }
  
  return predictions;
}

export async function trainNetwork(trainingData: TrainingData[]): Promise<any> {
  // Simple mock network for deployment compatibility
  return {
    run: (input: number[]) => {
      // Simple prediction based on average
      const avg = input.reduce((sum, val) => sum + val, 0) / input.length;
      return [avg * 1000]; // Denormalize
    }
  };
}

export function predictNextDays(network: any, prices: number[], daysToPredict: number): number[] {
  return simplePredict(prices, daysToPredict);
} 