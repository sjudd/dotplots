import { DATA_LIST } from '../components/fake.js';
import { parseEventList } from '../components/parse.js';
import UserRows from '../components/UserRows.js';
import React, { useEffect, useState } from "react";
import SetDates from '../components/SetDates.js';
import { useRouter } from 'next/router'

export default function DotPlot() {
  const router = useRouter();
  // Query parameters are populated iafter ReactDom.hydrate, so wait
  // for it to be ready before we try to read our params.
  const [ isLoading, setLoading ] = useState(true);
  useEffect(() => setLoading(!router.isReady), [router.isReady]);

  if (isLoading) {
    // TODO: Figure out some more reasonable loading UI.
    return;
  }


  const [ startDate, setStartDate ] = 
    useDateQueryParameter(router, 'start', "2022-12-01T00:00:00Z")
  const [ endDate, setEndDate ] = 
    useDateQueryParameter(router, 'end', "2022-12-30T00:00:00Z")

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


function useDateQueryParameter(router, key, defaultInitialValue) {
  var value = Date.parse(router.query[key]);
  if (!value) {
    value = Date.parse(defaultInitialValue);
    console.log(`Missing value! ${router.query[key]} setting`);
  }
  const setValue = 
    setQueryParameterFunction(router, key, (date) => date.toISOString());
  return [value, setValue];
}


function setQueryParameterFunction(router, key, toUrlParameter) {
  return (newDate) => {
    router.push({ 
      query: { ...router.query, [key]: toUrlParameter(newDate) } }, 
      undefined, 
      { shallow: true});
  }
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
        userIndexToKey={(index) => users[index]}
      />
  )
}

