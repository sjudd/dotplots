import styles from '../styles/UserRow.module.css';
export default function UserRow({ count, indexToChecked }) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const value = i in indexToChecked ? "x" : "";
    rows.push(<div key={i} className={styles.cell}>{value}</div>);
  }

  return <div className={styles.row}>{rows}</div>
}

