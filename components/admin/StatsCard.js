import styles from './StatsCard.module.css';

export default function StatsCard({ title, value, icon, color = 'coral' }) {
  let bgClass = styles.bgCoral;
  if (color === 'green') bgClass = styles.bgGreen;
  if (color === 'yellow') bgClass = styles.bgYellow;
  if (color === 'lavender') bgClass = styles.bgLavender;

  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${bgClass}`}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
      </div>
    </div>
  );
}
