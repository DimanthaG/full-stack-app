import * as brain from 'brain.js';

// Normalize data between 0 and 1
export function normalizeData(data: number[]): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(x => (x - min) / (max - min));
}

// Denormalize data back to original scale
export function denormalizeData(normalizedData: number[], originalData: number[]): number[] {
  const min = Math.min(...originalData);
  const max = Math.max(...originalData);
  return normalizedData.map(x => x * (max - min) + min);
}

// Prepare data for training
export function prepareTrainingData(prices: number[]): { input: number[]; output: number[] }[] {
  const normalizedPrices = normalizeData(prices);
  const trainingData = [];

  // Use 5 days of data to predict the next day
  for (let i = 0; i < normalizedPrices.length - 5; i++) {
    trainingData.push({
      input: normalizedPrices.slice(i, i + 5),
      output: [normalizedPrices[i + 5]]
    });
  }

  return trainingData;
}

// Create and train the neural network
export async function trainNetwork(trainingData: { input: number[]; output: number[] }[]): Promise<brain.NeuralNetwork> {
  const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3], // number of neurons in hidden layer
    activation: 'sigmoid'
  };

  const net = new brain.NeuralNetwork(config);
  await net.trainAsync(trainingData, {
    iterations: 1000,
    errorThresh: 0.005,
    log: true,
    logPeriod: 100
  });

  return net;
}

// Make predictions
export function predictNextDays(
  network: brain.NeuralNetwork,
  lastPrices: number[],
  daysToPredict: number
): number[] {
  const normalizedLastPrices = normalizeData(lastPrices);
  const predictions = [];
  let currentInput = normalizedLastPrices.slice(-5);

  for (let i = 0; i < daysToPredict; i++) {
    const prediction = network.run(currentInput)[0];
    predictions.push(prediction);
    currentInput = [...currentInput.slice(1), prediction];
  }

  return denormalizeData(predictions, lastPrices);
}

// Sample stock data (you can replace this with real data)
export const sampleStockData = {
  dates: Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (49 - i));
    return date.toISOString().split('T')[0];
  }),
  prices: Array.from({ length: 50 }, (_, i) => {
    // Generate some sample price data with a general upward trend and some randomness
    return 100 + i * 0.5 + Math.random() * 5 - 2.5;
  })
}; 