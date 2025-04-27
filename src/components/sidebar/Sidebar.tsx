import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';

import styles from './Sidebar.module.css';

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<IProps> = ({ isOpen, setIsOpen }) => {
  const t = useTranslations('Sidebar');
  const router = useRouter();

  return (
    <nav className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
      <div
        className={styles.logo}
        style={{
          padding: '15px',
        }}
      >
        <Image
          alt="Logo"
          height={isOpen ? 46 : 38}
          src={isOpen ? '/logo.png' : '/logo-mini.png'}
          width={isOpen ? 120 : 36}
        />
        <div className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
          <Image
            alt="Right icon"
            height={12}
            src="/icons/arrow.svg"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            width={14}
          />
        </div>
      </div>
      <ul>
        <li className={styles['sidebar-item']} onClick={() => router.push('/dashboard')}>
          <Image alt="Dashboard icon" height={24} src="/icons/dashboard.svg" width={24} />
          {isOpen && <span>{t('dashboard')}</span>}
        </li>
        <li className={styles['sidebar-item']} onClick={() => router.push('/calculator')}>
          <Image alt="Calculator icon" height={24} src="/icons/calculator.svg" width={24} />
          {isOpen && <span>{t('calculator')}</span>}
        </li>
        <li className={styles['sidebar-item']} onClick={() => router.push('/calendar')}>
          <Image alt="Calendar icon" height={24} src="/icons/calendar.svg" width={24} />
          {isOpen && <span>{t('calendar')}</span>}
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
