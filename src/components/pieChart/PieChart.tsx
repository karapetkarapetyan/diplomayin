import React from 'react';
import ReactECharts from 'echarts-for-react';
import styles from './PiceChart.module.css';

interface IProps {
  title: string;
  data: { value: string; name: string }[];
}

const PieChart: React.FC<IProps> = ({ title, data }) => {
  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '80%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Nunito',
          },
        },
        labelLine: {
          show: false,
        },
        data,
        color: ['#8CAAB9', '#D6BDA5', '#E84544', '#397F87'],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <ReactECharts option={chartOptions} />
    </div>
  );
};

export default PieChart;
