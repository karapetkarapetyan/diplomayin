import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/input/Input';
import styles from './EngagementMetrics.module.css';

const EngagementMetrics: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [reach, setReach] = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [conversions, setConversions] = useState(0);

  const engagementRate = followers > 0 ? ((likes + comments + shares) / followers) * 100 : 0;
  const reachRate = followers > 0 ? (reach / followers) * 100 : 0;
  const impressionsPerFollower = followers > 0 ? impressions / followers : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

  const t = useTranslations('Calculator');

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{t('epmetrics')}</h2>
      <div className={styles.inputsGrid}>
        <Input
          label={t('likes')}
          value={likes.toString()}
          onChange={(value) => setLikes(Number(value))}
        />
        <Input
          label={t('comments')}
          value={comments.toString()}
          onChange={(value) => setComments(Number(value))}
        />
        <Input
          label={t('shares')}
          value={shares.toString()}
          onChange={(value) => setShares(Number(value))}
        />
        <Input
          label={t('followers')}
          value={followers.toString()}
          onChange={(value) => setFollowers(Number(value))}
        />
        <Input
          label={t('reach')}
          value={reach.toString()}
          onChange={(value) => setReach(Number(value))}
        />
        <Input
          label={t('impressions')}
          value={impressions.toString()}
          onChange={(value) => setImpressions(Number(value))}
        />
        <Input
          label={t('clicks')}
          value={clicks.toString()}
          onChange={(value) => setClicks(Number(value))}
        />
        <Input
          label={t('conversions')}
          value={conversions.toString()}
          onChange={(value) => setConversions(Number(value))}
        />
      </div>

      <div className={styles.results}>
        <p>
          <strong>{t('EngagementRate')}</strong> {engagementRate.toFixed(2)}%
        </p>
        <p>
          <strong>{t('ReachRate')}</strong> {reachRate.toFixed(2)}%
        </p>
        <p>
          <strong>{t('ImpressionsperFollower')}</strong> {impressionsPerFollower.toFixed(2)}
        </p>
        <p>
          <strong>{t('Click-ThroughRate(CTR)')}</strong> {ctr.toFixed(2)}%
        </p>
        <p>
          <strong>{t('ConversionRate')}</strong> {conversionRate.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default EngagementMetrics;
