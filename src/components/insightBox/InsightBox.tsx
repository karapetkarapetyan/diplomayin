import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SocialNetwork, Statistics } from '@/types/statistics';
import SelectInput, { Option } from '@/components/selectInput/SelectInput';
import styles from './InsightBox.module.css';

interface IProps {
  data: Statistics | null;
}

export const SOCIAL_NETWORK_OPTIONS = [
  {
    label: 'Facebook',
    value: SocialNetwork.Facebook,
  },
  {
    label: 'Instagram',
    value: SocialNetwork.Instagram,
  },
  {
    label: 'TikTok',
    value: SocialNetwork.TikTok,
  },
  {
    label: 'YouTube',
    value: SocialNetwork.YouTube,
  },
];

const InsightBox: React.FC<IProps> = ({ data }) => {
  const t = useTranslations('Dashboard');
  const [selectedNetwork, setSelectedNetwork] = useState<Option>(SOCIAL_NETWORK_OPTIONS[0]);

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'; // 1.2M
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'; // 1.9K
    return num.toString();
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Image
            alt={selectedNetwork.value}
            height={28}
            src={`/icons/social/${selectedNetwork.value}.svg`}
            width={28}
          />
          {selectedNetwork.label}
        </h3>
        <SelectInput
          options={SOCIAL_NETWORK_OPTIONS}
          value={selectedNetwork}
          onChange={(value) => setSelectedNetwork(value)}
        />
      </div>
      <div className={styles.items}>
        {Object.entries(data[selectedNetwork.value as SocialNetwork].statistics).map(
          ([key, value]) => (
            <div className={styles.item} key={key}>
              <p className={styles['item-value']}>{formatNumber(value)}</p>
              <p className={styles['item-label']}>{t(key)}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default InsightBox;
