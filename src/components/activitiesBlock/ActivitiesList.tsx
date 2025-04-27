import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import styles from '@/components/activitiesBlock/ActivitiesBlock.module.css';
import { IActivity } from '@/components/activitiesBlock/ActivitiesBlock';

interface IProps {
  activities: IActivity[];
}

const ActivitiesList: React.FC<IProps> = ({ activities }) => {
  const t = useTranslations('Dashboard');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    // if (isToday(date)) {
    //   return formatDistanceToNow(date, { addSuffix: true });
    // }
    //
    // if (isYesterday(date)) {
    //   return 'yesterday';
    // }

    return format(date, 'dd.MM.yyyy');
  };

  if (!activities || activities.length <= 0) {
    return null;
  }

  return (
    <ul className={styles.activities}>
      {activities
        ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((item: IActivity, index: number) => (
          <li className={styles.activity} key={index}>
            <div className={styles['activity-header']}>
              <Image alt="Default avatar" height={20} src="/default-avatar.png" width={20} />
              <p className={styles['action-info']}>
                {`${item.firstname} ${item.lastname}`}{' '}
                <span>{t(item.action.split(' ').join('-'))}</span>
              </p>
            </div>

            {item?.message ? <p className={styles['action-text']}>{item.message}</p> : null}
            {item?.comment ? <p className={styles['action-text']}>{item.comment}</p> : null}
            <div className={styles['activity-item']}>
              <p className={styles['action-date']}>{formatTimestamp(item.timestamp)}</p>
              <p className={styles['action-website']}>
                <Image
                  alt={item.website}
                  height={20}
                  src={`/icons/social/${item.website}.svg`}
                  width={20}
                />
                {item.website}
              </p>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default ActivitiesList;
