import React, { useState } from 'react';
import styles from './ContentStrategyTools.module.css';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['Morning', 'Afternoon', 'Evening'];

const ContentStrategyTools: React.FC = () => {
  const [engagement, setEngagement] = useState<Record<string, number>>({});
  const [posts, setPosts] = useState(0);
  const [goal, setGoal] = useState(7);

  const handleEngagementChange = (key: string, value: number) => {
    setEngagement((prev) => ({ ...prev, [key]: value }));
  };

  const bestTime = Object.entries(engagement).reduce(
    (best, current) => (current[1] > (engagement[best[0]] ?? 0) ? current : best),
    ['none', 0],
  )[0];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📅 Content & Posting Strategy Tools</h2>

      <div className={styles.subsection}>
        <h3>⏰ Best Time to Post Analyzer</h3>
        <div className={styles.grid}>
          {days.map((day) =>
            times.map((time) => {
              const key = `${day}-${time}`;
              return (
                <label className={styles.label} key={key}>
                  {key}
                  <input
                    className={styles.input}
                    type="number"
                    value={engagement[key] ?? 0}
                    onChange={(e) => handleEngagementChange(key, Number(e.target.value))}
                  />
                </label>
              );
            }),
          )}
        </div>
        <p className={styles.result}>
          <strong>Best Time to Post:</strong> {bestTime}
        </p>
      </div>

      <div className={styles.subsection}>
        <h3>📈 Post Frequency Tracker</h3>
        <label className={styles.label}>
          Posts This Week
          <input
            className={styles.input}
            type="number"
            value={posts}
            onChange={(e) => setPosts(Number(e.target.value))}
          />
        </label>
        <label className={styles.label}>
          Weekly Goal
          <input
            className={styles.input}
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
          />
        </label>
        <p className={styles.result}>
          <strong>Status:</strong> {posts >= goal ? '✅ Goal Met' : `📉 ${goal - posts} to go`}
        </p>
      </div>
    </div>
  );
};

export default ContentStrategyTools;
