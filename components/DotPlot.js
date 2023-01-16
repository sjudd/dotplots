import { DATA_LIST } from '../components/fake.js';
import { parseEventList, COUNT, USERS, ALL_EVENTS, ALL_STATES, STATE_MAPS } from '../components/parse.js';
import UserRows from '../components/UserRows.js';
import SetDates from '../components/SetDates.js';
import EventPicker from '../components/EventPicker.js';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from "react";

export default function DotPlot() {
  const router = useRouter();
  // Query parameters are populated after ReactDom.hydrate, so wait
  // for it to be ready before we try to read our params.
  const [ isLoading, setLoading ] = useState(true);
  useEffect(() => setLoading(!router.isReady), [router.isReady]);

  if (isLoading) {
    // TODO: Figure out some more reasonable loading UI.
    return;
  }

  const [selectedEvent, setSelectedEvent] = 
    useQueryParameter(router, 'event');
  const [selectedState, setSelectedState] = 
    useQueryParameter(router, 'state');
  const [ startDate, setStartDate ] = 
    useDateQueryParameter(router, 'start', "2022-12-01T00:00:00Z");
  const [ endDate, setEndDate ] = 
    useDateQueryParameter(router, 'end', "2022-12-30T00:00:00Z");

  const eventList = parseEventList(DATA_LIST, startDate, endDate);
  console.log(eventList);

  return ( 
    <div>
      <EventPicker 
        eventNames={eventList[ALL_EVENTS]} 
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent} />
      <EventPicker 
        eventNames={eventList[ALL_STATES]} 
        selectedEvent={selectedState}
        setSelectedEvent={setSelectedState} />
      <SetDates 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate}
        setEndDate={setEndDate} />
      <UserRowsFromEventList eventList={eventList} selectedEvent={selectedEvent} selectedState = {selectedState} />
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

function useQueryParameter(router, key) {
  const value = router.query[key];
  const setValue = 
    setQueryParameterFunction(router, key, (value) => value);
  return [value, setValue]
}


function setQueryParameterFunction(router, key, toUrlParameter) {
  return (newDate) => {
    router.push({ 
      query: { ...router.query, [key]: toUrlParameter(newDate) } }, 
      undefined, 
      { shallow: true});
  }
}

function isCheckedInUser(rowIndex, columnIndex, eventList, users, selected, mapKey) {
  const userStateMap = eventList["users"][users[rowIndex]][mapKey]
  if (selected in userStateMap) {
    return userStateMap[selected][columnIndex] > 0;
  } else {
    return false;
  }
}


function UserRowsFromEventList({eventList, selectedEvent, selectedState}) {
  const count = eventList[COUNT];
  const users = Object.keys(eventList[USERS]);
  const isColumnColored = (rowIndex, columnIndex) => {
    return isCheckedInUser(rowIndex, columnIndex, eventList, users, selectedState, STATE_MAPS);
  };
  const isColumnChecked = (rowIndex, columnIndex) => {
    return isCheckedInUser(rowIndex, columnIndex, eventList, users, selectedEvent, "event_maps");
  }
  return ( 
      <UserRows 
        totalRows={users.length}
        totalColumns={count}
        isColumnChecked={isColumnChecked}
        isColumnColored={isColumnColored}
        userIndexToKey={(index) => users[index]}
      />
  )
}

