import React, { useState } from 'react';
import styles from './AudienceHealth.module.css';

const AudienceHealth: React.FC = () => {
  const [startFollowers, setStartFollowers] = useState(0);
  const [newFollowers, setNewFollowers] = useState(0);
  const [lostFollowers, setLostFollowers] = useState(0);

  const growthRate =
    startFollowers > 0 ? ((newFollowers - lostFollowers) / startFollowers) * 100 : 0;
  const churnRate = startFollowers > 0 ? (lostFollowers / startFollowers) * 100 : 0;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📊 Audience Growth & Health</h2>

      <div className={styles.inputsGrid}>
        <label>
          Followers at Start
          <input
            type="number"
            value={startFollowers}
            onChange={(e) => setStartFollowers(Number(e.target.value))}
          />
        </label>
        <label>
          New Followers
          <input
            type="number"
            value={newFollowers}
            onChange={(e) => setNewFollowers(Number(e.target.value))}
          />
        </label>
        <label>
          Lost Followers
          <input
            type="number"
            value={lostFollowers}
            onChange={(e) => setLostFollowers(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.results}>
        <p>
          <strong>Follower Growth Rate:</strong> {growthRate.toFixed(2)}%
        </p>
        <p>
          <strong>Churn Rate:</strong> {churnRate.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default AudienceHealth;
