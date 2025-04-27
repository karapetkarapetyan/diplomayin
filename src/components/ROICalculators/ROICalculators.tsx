import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/input/Input';
import SelectInput, { Option } from '@/components/selectInput/SelectInput';
import useCurrencyConversion from '@/hooks/useCurrencyConversion';
import styles from './ROICalculators.module.css';

const ROICalculators: React.FC = () => {
  const { convert, convertBack, currencies } = useCurrencyConversion('USD');
  const [currency, setCurrency] = useState<Option>({ label: 'USD', value: 'USD' });

  const [cost, setCost] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [acquisitions, setAcquisitions] = useState(0);

  const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;
  const cpc = clicks > 0 ? cost / clicks : 0;
  const cpm = impressions > 0 ? (cost / impressions) * 1000 : 0;
  const cpa = acquisitions > 0 ? cost / acquisitions : 0;

  const [convertedCost, setConvertedCost] = useState(cost);
  const [convertedRevenue, setConvertedRevenue] = useState(revenue);
  const [convertedCpc, setConvertedCpc] = useState(cpc);
  const [convertedCpm, setConvertedCpm] = useState(cpm);
  const [convertedCpa, setConvertedCpa] = useState(cpa);

  useEffect(() => {
    setConvertedCost(convert(cost, currency.value));
    setConvertedRevenue(convert(revenue, currency.value));
    setConvertedCpc(convert(cpc, currency.value));
    setConvertedCpm(convert(cpm, currency.value));
    setConvertedCpa(convert(cpa, currency.value));
  }, [currency, cost, revenue, clicks, impressions, acquisitions]);

  const t = useTranslations('Calculator');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t('rcc')}</h2>
        <SelectInput
          options={currencies.map((item) => ({ label: item, value: item }))}
          placeholder={t('currency')}
          value={currency}
          onChange={setCurrency}
        />
      </div>
      <div className={styles.inputsGrid}>
        <Input
          label={t('total-ad-spend', { currency: currency.value })}
          value={Math.round(convertedCost).toString()}
          onChange={(value) => {
            const newCost = Number(value);
            setConvertedCost(newCost);
            setCost(convertBack(newCost, currency.value));
          }}
        />
        <Input
          label={t('revenue-generated', { currency: currency.value })}
          value={Math.round(convertedRevenue).toString()}
          onChange={(value) => {
            const newRevenue = Number(value);
            setConvertedRevenue(newRevenue);
            setRevenue(convertBack(newRevenue, currency.value));
          }}
        />
        <Input
          label={t('clicks')}
          value={clicks.toString()}
          onChange={(value) => setClicks(Number(value))}
        />
        <Input
          label={t('impressions')}
          value={impressions.toString()}
          onChange={(value) => setImpressions(Number(value))}
        />
        <Input
          label={t('acquisitions')}
          value={acquisitions.toString()}
          onChange={(value) => setAcquisitions(Number(value))}
        />
      </div>
      <div className={styles.results}>
        <p>
          <strong>{t('roi')}</strong> {roi.toFixed(2)}%
        </p>
        <p>
          <strong>{t('cpc')}</strong> {currency.value} {convertedCpc.toFixed(2)}
        </p>
        <p>
          <strong>{t('cpm')}</strong> {currency.value} {convertedCpm.toFixed(2)}
        </p>
        <p>
          <strong>{t('cpa')}</strong> {currency.value} {convertedCpa.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ROICalculators;
