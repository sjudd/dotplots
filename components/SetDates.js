import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/SetDates.module.css";

export default function SetDates({startDate, setStartDate, endDate, setEndDate}) {
  return (
    <div className={styles.set_dates}>
      <DateAndLabel 
        label={"Start Date:"} 
        date={startDate} 
        setDate={(newDate) => validateSetStartDate(newDate, endDate, setStartDate)}/>
      <DateAndLabel 
        label={"End Date:"} 
        date={endDate} 
        setDate={(newDate) => validateSetEndDate(newDate, startDate, setEndDate)}/>
    </div>
  )
}

function DateAndLabel({label, date, setDate}) {
  return (
    <div className={styles.picker_and_label}>
      <div className={styles.label}>
        {label}
      </div>
      <DatePicker 
        className={styles.picker}
        selected={date} 
        onChange={(newDate) => setDate(newDate)} />
    </div>
  )
}

function validateSetEndDate(newEndDate, startDate, setEndDate) {
  if (startDate >= newEndDate) {
    return;
  }
  setEndDate(newEndDate);
}

function validateSetStartDate(newStartDate, endDate, setStartDate) {
  if (newStartDate >= endDate) {
    return;
  }
  setStartDate(newStartDate)
}



