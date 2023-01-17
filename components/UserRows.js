import styles from '../styles/UserRows.module.css';

function UserRow({ columnCount, isColumnChecked, isColumnColored }) {
  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    const checkValue = isColumnChecked(i) ? "x" : "\u200b";
    const isColored = isColumnColored(i);
    columns.push(<div key={i} className={isColored ? styles.cellColored : styles.cell}>{checkValue}</div>);
  }

  return <div className={styles.row}>{columns}</div>
}

export default function UserRows({ totalRows, totalColumns, isColumnChecked, isColumnColored, userIndexToKey }) {
  const rows = []
  for (let i = 0; i < totalRows; i++) {
    rows.push(
      <UserRow 
        key={userIndexToKey(i)}
        columnCount={totalColumns} 
        isColumnChecked={(columnIndex) => isColumnChecked(i, columnIndex)}
        isColumnColored={(columnIndex) => isColumnColored(i, columnIndex)}
      />
    )
  }

  return (
    <div className={styles.allrows}>{rows}</div>
  )
}

