import React, { useState } from 'react';
import styles from './Tabs.module.css';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        {tabs.map((tab, index) => (
          <button
            className={`${styles.tabButton} ${activeTabIndex === index ? styles.activeTab : ''}`}
            key={index}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>{tabs[activeTabIndex]?.content}</div>
    </div>
  );
};

export default Tabs;
