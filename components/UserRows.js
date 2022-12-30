import styles from '../styles/UserRows.module.css';

function UserRow({ columnCount, isColumnChecked }) {
  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    const value = isColumnChecked(i) ? "x" : "";
    columns.push(<div key={i} className={styles.cell}>{value}</div>);
  }

  return <div className={styles.row}>{columns}</div>
}

export default function UserRows({ totalRows, totalColumns, isChecked }) {
  const rows = []
  for (let i = 0; i < totalRows; i++) {
    rows.push(
      <UserRow 
        columnCount={totalColumns} 
        isColumnChecked={(columnIndex) => isChecked(i, columnIndex)}
      />
    )
  }

  return (
    <div className={styles.allrows}>{rows}</div>
  )
}

