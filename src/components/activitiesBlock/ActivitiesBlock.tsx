'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Tabs from '@/components/tabs/Tabs';
import ActivitiesList from '@/components/activitiesBlock/ActivitiesList';
import SelectInput, { Option } from '@/components/selectInput/SelectInput';
import { SocialNetwork } from '@/types/statistics';
import { SOCIAL_NETWORK_OPTIONS } from '@/components/insightBox/InsightBox';
import styles from './ActivitiesBlock.module.css';

export interface IActivities {
  comment: IActivity[];
  message: IActivity[];
  follow_request: IActivity[];
}

export interface IActivity {
  type: string;
  website: string;
  lastname: string;
  comment?: string;
  message?: string;
  timestamp: string;
  action: string;
  firstname: string;
}

interface IAllActivities {
  key: 'comment' | 'message' | 'follow_request';
  label: string;
  content: ReactNode | null;
}

interface IProps {
  activities: IActivities;
}

const ActivitiesBlock: React.FC<IProps> = ({ activities }) => {
  const t = useTranslations('Dashboard');

  const [selectedNetwork, setSelectedNetwork] = useState<Option>({
    label: t('show-all'),
    value: 'all',
  });

  const [allActivities, setAllActivities] = useState<IAllActivities[]>([
    { key: 'message', label: t('inbox'), content: null },
    {
      key: 'follow_request',
      label: t('follow-requests'),
      content: null,
    },
    { key: 'comment', label: t('comments'), content: null },
  ]);

  useEffect(() => {
    if (activities) {
      const newActivities = allActivities.map((el: IAllActivities) => {
        const filteredActivities =
          selectedNetwork.value !== 'all'
            ? activities[el.key].filter(
                (activity: IActivity) => activity.website === selectedNetwork.value,
              )
            : activities[el.key];

        const content = <ActivitiesList activities={filteredActivities} />;

        return { ...el, content };
      });

      setAllActivities(newActivities);
    }
  }, [activities, selectedNetwork]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('all-activities')}</h3>
        <SelectInput
          options={[{ label: t('show-all'), value: 'all' }, ...SOCIAL_NETWORK_OPTIONS]}
          placeholder="Select a platform"
          value={selectedNetwork}
          onChange={(value) => setSelectedNetwork(value)}
        />
      </div>
      <Tabs tabs={allActivities} />
    </div>
  );
};

export default ActivitiesBlock;
