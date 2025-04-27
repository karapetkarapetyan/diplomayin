import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import useCurrencyConversion from '@/hooks/useCurrencyConversion';
import SelectInput, { Option } from '@/components/selectInput/SelectInput';
import Input from '@/components/input/Input';
import styles from './CampaignPlanner.module.css';

const CampaignPlanner: React.FC = () => {
  const { convert, convertBack, currencies } = useCurrencyConversion('USD');
  const [currency, setCurrency] = useState<Option>({ label: 'USD', value: 'USD' });

  const [baseBudget, setBaseBudget] = useState(1000);
  const [baseCpc, setBaseCpc] = useState(2);
  const [baseCpm, setBaseCpm] = useState(10);
  const [duration, setDuration] = useState(30);

  const [convertedBudget, setConvertedBudget] = useState(baseBudget);
  const [convertedCpc, setConvertedCpc] = useState(baseCpc);
  const [convertedCpm, setConvertedCpm] = useState(baseCpm);

  useEffect(() => {
    setConvertedBudget(convert(baseBudget, currency.value));
    setConvertedCpc(convert(baseCpc, currency.value));
    setConvertedCpm(convert(baseCpm, currency.value));
  }, [currency, baseBudget, baseCpc, baseCpm]);

  const dailyBudget = duration > 0 ? convertedBudget / duration : 0;
  const estimatedClicks = convertedCpc > 0 ? convertedBudget / convertedCpc : 0;
  const estimatedImpressions = convertedCpm > 0 ? (convertedBudget / convertedCpm) * 1000 : 0;

  const t = useTranslations('Calculator');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t('cbp')}</h2>
        <SelectInput
          options={currencies.map((item) => ({ label: item, value: item }))}
          placeholder={t('currency')}
          value={currency}
          onChange={setCurrency}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.grid}>
          <Input
            label={t('total-budget', { currency: currency.value })}
            value={Math.round(convertedBudget).toString()}
            onChange={(value) => {
              const newBudget = Number(value);
              setConvertedBudget(newBudget);
              setBaseBudget(convertBack(newBudget, currency.value));
            }}
          />
          <Input
            label={t('campaignduration')}
            value={duration.toString()}
            onChange={(value) => setDuration(Number(value))}
          />
          <Input
            label={t('estimated-cpc', { currency: currency.value })}
            value={Math.round(convertedCpc).toString()}
            onChange={(value) => {
              const newCpc = Number(value);
              setConvertedCpc(newCpc);
              setBaseCpc(convertBack(newCpc, currency.value));
            }}
          />
          <Input
            label={t('estimated-cpm', { currency: currency.value })}
            value={Math.round(convertedCpm).toString()}
            onChange={(value) => {
              const newCpm = Number(value);
              setConvertedCpm(newCpm);
              setBaseCpm(convertBack(newCpm, currency.value));
            }}
          />
        </div>

        <div className={styles.results}>
          <p className={styles.resultItem}>
            <strong>{t('dailybudget')}</strong> {currency.value} {dailyBudget.toFixed(2)}
          </p>
          <p className={styles.resultItem}>
            <strong>{t('estimatedclicks')}</strong> {estimatedClicks.toFixed(0)}
          </p>
          <p className={styles.resultItem}>
            <strong>{t('estimatedimpressions')}</strong> {estimatedImpressions.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignPlanner;
