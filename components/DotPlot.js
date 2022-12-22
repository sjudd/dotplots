import { DATA_LIST } from '../components/fake.js';
import { parseEventList } from '../components/parse.js';
import UserRow from '../components/user_row.js';
import styles from '../styles/DotPlot.module.css';

export default function DotPlot() {
  var eventList = parseEventList(
    DATA_LIST, 
    Date.parse("2022-12-06T00:00:00Z"), 
    Date.parse("2022-12-18T00:00:00Z"));
  console.log(eventList);


  const selectedEvent = "OpenApp";
  const count = eventList["count"];

  return ( 
    <div className={styles.allrows}>
    { 
      Object.keys(eventList["users"]).map((userId, index) => 
      (
        <UserRow count={count} indexToChecked={eventList["users"][userId]["event_maps"][selectedEvent]} />
      ))
    }
    </div>
  )
}

