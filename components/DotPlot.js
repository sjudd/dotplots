import { DATA_LIST } from '../components/fake.js';
import { parseEventList } from '../components/parse.js';
import UserRows from '../components/UserRows.js';
import React, { useState } from "react";
import SetDates from '../components/SetDates.js';

export default function DotPlot() {
  const [startDate, setStartDate] = useState(Date.parse("2022-12-06T00:00:00Z"));
  const [endDate, setEndDate] = useState(Date.parse("2022-12-18T00:00:00Z"));

  var eventList = parseEventList(DATA_LIST, startDate, endDate);
  console.log(eventList);

  const selectedEvent = "OpenApp";

  return ( 
    <div>
      <SetDates 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate}
        setEndDate={setEndDate} />
      <UserRowsFromEventList eventList={eventList} selectedEvent={selectedEvent} />
    </div>
  )
}

function UserRowsFromEventList({eventList, selectedEvent}) {
  const count = eventList["count"];
  const users = Object.keys(eventList["users"])
  return ( 
      <UserRows 
        totalRows={users.length}
        totalColumns={count}
        isChecked={
          (rowIndex, columnIndex) => {
            const userEventMap = eventList["users"][users[rowIndex]]["event_maps"];
            if (selectedEvent in userEventMap) {
              return userEventMap[selectedEvent][columnIndex];
            } else {
              return false;
            }
          }
        }
      />
  )
}

