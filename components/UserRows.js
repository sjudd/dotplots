import styles from '../styles/UserRows.module.css';

function UserRow({ columnCount, isColumnChecked }) {
  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    const value = isColumnChecked(i) ? "x" : "\u200b";
    columns.push(<div key={i} className={styles.cell}>{value}</div>);
  }

  return <div className={styles.row}>{columns}</div>
}

export default function UserRows({ totalRows, totalColumns, isChecked, userIndexToKey}) {
  const rows = []
  for (let i = 0; i < totalRows; i++) {
    rows.push(
      <UserRow 
        key={userIndexToKey(i)}
        columnCount={totalColumns} 
        isColumnChecked={(columnIndex) => isChecked(i, columnIndex)}
      />
    )
  }

  return (
    <div className={styles.allrows}>{rows}</div>
  )
}

