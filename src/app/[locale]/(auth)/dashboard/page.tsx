'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from '@firebase/firestore';
import { useTranslations } from 'next-intl';
import withAuth from '@/lib/withAuth';
import { auth, db } from '@/firebase/config';
import InsightBox from '@/components/insightBox/InsightBox';
import { Statistics } from '@/types/statistics';
import FollowerGrowthChart from '@/components/followerGrowthChart/FollowerGrowthChart';
import PieChart from '@/components/pieChart/PieChart';
import ActivitiesBlock, { IActivity } from '@/components/activitiesBlock/ActivitiesBlock';
import styles from './page.module.css';

export interface TransformedData {
  likes: { value: string; name: string }[];
  followers: { value: string; name: string }[];
  comments: { value: string; name: string }[];
  views: { value: string; name: string }[];
}

function DashboardPage() {
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    if (user) {
      const uid = user?.uid;

      const fetchStats = async () => {
        const statsRef = doc(db, 'statistics', uid);
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          setStats(statsSnap.data() as Statistics);
        }
      };

      fetchStats();
    }
  }, [user]);

  const transformData = (data: Statistics): TransformedData => {
    const categories: (keyof TransformedData)[] = ['likes', 'followers', 'comments', 'views'];

    const totals = categories.reduce(
      (acc, category) => {
        acc[category] = Object.values(data).reduce(
          (sum, details) => sum + (details.statistics?.[category] || 0),
          0,
        );
        return acc;
      },
      {} as Record<keyof TransformedData, number>,
    );

    return categories.reduce((acc, category) => {
      acc[category] = Object.entries(data)
        .filter(([_, details]) => details.statistics?.[category] !== undefined)
        .map(([name, details]) => ({
          value: Number((details.statistics![category] / totals[category]) * 100).toFixed(0),
          name,
        }));
      return acc;
    }, {} as TransformedData);
  };

  const groupActivitiesByAction = (data: Statistics): any => {
    const groupedActivities: any = {
      comment: [],
      message: [],
      follow_request: [],
    };

    Object.values(data).forEach((platform) => {
      if (platform?.activities) {
        platform.activities.forEach((activity: IActivity) => {
          if (groupedActivities[activity.type]) {
            groupedActivities[activity.type].push(activity);
          }
        });
      }
    });

    return groupedActivities;
  };

  const t = useTranslations('Dashboard');

  return (
    <div className={styles.container}>
      <div className={styles['inner-container']}>
        {stats && <InsightBox data={stats} />}
        {stats && <FollowerGrowthChart chartData={stats} />}
        {stats && (
          <div className={styles['charts-wrapper']}>
            <PieChart data={transformData(stats).likes} title={t('likes')} />
            <PieChart data={transformData(stats).followers} title={t('followers')} />
            <PieChart data={transformData(stats).comments} title={t('comments')} />
            <PieChart data={transformData(stats).views} title={t('views')} />
          </div>
        )}
      </div>
      {stats && <ActivitiesBlock activities={groupActivitiesByAction(stats)} />}
    </div>
  );
}

export default withAuth(DashboardPage);
