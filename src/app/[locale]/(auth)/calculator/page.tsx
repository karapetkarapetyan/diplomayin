'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import withAuth from '@/lib/withAuth';
import EngagementMetrics from '@/components/EngagementMetrics/EngagementMetrics';
import Tabs from '@/components/tabs/Tabs';
import ROICalculators from '@/components/ROICalculators/ROICalculators';
import CampaignPlanner from '@/components/CampaignPlanner/CampaignPlanner';
import InfluencerMetrics from '@/components/InfluencerMetrics/InfluencerMetrics';
import styles from './page.module.css';

function CalculatorPage() {
  const t = useTranslations('Calculator');

  const tabs = [
    {
      key: 'engagementMetrics',
      label: t('engagementMetrics'),
      content: <EngagementMetrics />,
    },
    {
      key: 'costCalculations',
      label: t('costCalculations'),
      content: <ROICalculators />,
    },
    // {
    //   key: 'contentStrategy',
    //   label: ' Content & Posting Strategy',
    //   content: <ContentStrategyTools />,
    // },
    // {
    //   key: 'audienceHealth',
    //   label: 'Audience Health',
    //   content: <AudienceHealth />,
    // },
    {
      key: 'campaignPlanner',
      label: t('campaignPlanner'),
      content: <CampaignPlanner />,
    },
    {
      key: 'influencerMetrics',
      label: t('influencerMetrics'),
      content: <InfluencerMetrics />,
    },
  ];

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('header')}</h2>
        <p className={styles.description}>{t('description')}</p>
      </div>
      <Tabs tabs={tabs} />
    </main>
  );
}

export default withAuth(CalculatorPage);
