import { useState, useEffect } from 'react';

const useCurrencyConversion = (baseCurrency: string) => {
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const currencies = ['USD', 'EUR', 'RUB', 'AMD'];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/78d58354c5a32210b615ddf1/latest/${baseCurrency}`,
        );
        const data = await res.json();
        if (data.result === 'success') {
          setRates(data.conversion_rates);
        } else {
          console.error('Error fetching conversion rates');
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
      setLoading(false);
    };

    fetchRates();
  }, [baseCurrency]);

  const convert = (amount: number, targetCurrency: string) => {
    if (rates[targetCurrency]) {
      return amount * rates[targetCurrency];
    }
    return amount;
  };

  const convertBack = (amount: number, sourceCurrency: string) => {
    if (rates[sourceCurrency]) {
      return amount / rates[sourceCurrency];
    }
    return amount;
  };

  return { convert, convertBack, loading, currencies };
};

export default useCurrencyConversion;
