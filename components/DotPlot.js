import { DATA_LIST } from '../components/fake.js';
import { parseEventList } from '../components/parse.js';
import UserRows from '../components/UserRows.js';

export default function DotPlot() {
  var eventList = parseEventList(
    DATA_LIST, 
    Date.parse("2022-12-06T00:00:00Z"), 
    Date.parse("2022-12-18T00:00:00Z"));
  console.log(eventList);

  const selectedEvent = "OpenApp";

  return ( 
    <UserRowsFromEventList eventList={eventList} selectedEvent={selectedEvent}/>
  )
}

function UserRowsFromEventList({eventList, selectedEvent}) {
  const count = eventList["count"];
  const users = Object.keys(eventList["users"])
  return ( 
      <UserRows 
        totalRows={users.length}
        totalColumns={count}
        isChecked={(rowIndex, columnIndex) => 
          eventList["users"][users[rowIndex]]["event_maps"][selectedEvent][columnIndex]
        }
      />
  )
}

