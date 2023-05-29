import axios from "axios";

const getExchangeRate = async (baseCurrency: string, targetCurrency: string) => {
  const response = await axios.get(`https://v6.exchangerate-api.com/v6/72426a8ea88aa5d2ea0feda0/latest/${baseCurrency}`);
  const data = response.data;
  const baseRate = data.conversion_rates[baseCurrency];
  const targetRate = data.conversion_rates[targetCurrency];

  return targetRate / baseRate;
}

export const usdToKgs = async (usdAmount: number ) => {
  const exchangeRate = await getExchangeRate('USD', 'KGS');
  return usdAmount * exchangeRate;
};

export const kgsToUsd = async (kgsAmount: number ) => {
  const exchangeRate = await getExchangeRate('USD', 'KGS');
  return kgsAmount / exchangeRate;
};

