import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react'; // Import ECharts component
import { useTranslations } from 'next-intl';
import SelectInput, { Option } from '@/components/selectInput/SelectInput';
import { SocialNetwork } from '@/types/statistics';
import { SOCIAL_NETWORK_OPTIONS } from '@/components/insightBox/InsightBox';
import styles from './FollowerGrowthChart.module.css';

export enum TimePeriod {
  WEEK = 'week',
  MONTH = 'month',
  TRIMESTER = 'trimester',
}

export const TIME_PERIODS_OPTIONS = (t: any) => [
  { label: t('week'), value: TimePeriod.WEEK },
  { label: t('month'), value: TimePeriod.MONTH },
  { label: t('trimester'), value: TimePeriod.TRIMESTER },
];

interface IProps {
  chartData: any;
}

const FollowerGrowthChart: React.FC<IProps> = ({ chartData }) => {
  const t = useTranslations('Dashboard');

  const [selectedPlatform, setSelectedPlatform] = useState<Option>(SOCIAL_NETWORK_OPTIONS[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<Option>(TIME_PERIODS_OPTIONS(t)[0]);

  const data = {
    name: selectedPlatform,
    data: chartData[selectedPlatform.value as SocialNetwork].followersGrowth[
      selectedPeriod.value as TimePeriod
    ],
  };

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: Array.from(
        {
          length:
            chartData[selectedPlatform.value as SocialNetwork].followersGrowth[
              selectedPeriod.value as TimePeriod
            ].length,
        },
        (_, i) => `${t('day')} ${i + 1}`,
      ),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: selectedPlatform,
        type: 'bar',
        data: data.data,
        itemStyle: {
          color: '#397F87',
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('followers-growth')}</h3>
        <div className={styles.filter}>
          <SelectInput
            options={SOCIAL_NETWORK_OPTIONS}
            value={selectedPlatform}
            onChange={setSelectedPlatform}
          />
          <SelectInput
            options={TIME_PERIODS_OPTIONS(t)}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </div>
      </div>
      <ReactECharts option={chartOptions} />
    </div>
  );
};

export default FollowerGrowthChart;
