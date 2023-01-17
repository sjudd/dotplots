import { DATA_LIST } from '../components/fake.js';
import { parseJsonData, COUNT, USERS, ALL_EVENTS, ALL_STATES, STATE_MAPS, EARLIEST_DATE, LATEST_DATE } from '../components/parse.js';
import UserRows from '../components/UserRows.js';
import SetDates from '../components/SetDates.js';
import EventPicker from '../components/EventPicker.js';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from "react";
import JsonFilePicker from '../components/JsonFilePicker.js';

const ZIP_FILENAME = "1";
const DATA_KEY = "data";

export default function DotPlot() {
  const router = useRouter();
  const [jsonData, setJsonData] = useState(null);
  // Query parameters are populated after ReactDom.hydrate, so wait
  // for it to be ready before we try to read our params.
  const [ isLoading, setLoading ] = useState(true);
  const [ isLoadingJson, setLoadingJson] = useState(false);

  useEffect(() => setLoading(!router.isReady), [router.isReady]);

  if (isLoading || isLoadingJson) {
    // TODO: Figure out some more reasonable loading UI.
    return;
  }

  if (jsonData == null && router.query[DATA_KEY] != null) {
    updateJsonDataFromQueryParameter(router, setLoadingJson, setJsonData);
    return;
  }

  const [selectedEvent, setSelectedEvent] = 
    useQueryParameter(router, 'event');
  const [selectedState, setSelectedState] = 
    useQueryParameter(router, 'state');
  const [ startDate, setStartDate ] = 
    useDateQueryParameter(router, 'start', null);
  const [ endDate, setEndDate ] = 
    useDateQueryParameter(router, 'end', null);

  const parsedData = parseJsonData(jsonData == null ? [] : jsonData["events"], startDate, endDate);
  if (!startDate && parsedData[EARLIEST_DATE]) {
    setStartDate(new Date(parsedData[EARLIEST_DATE]));
  }
  if (!endDate && parsedData[LATEST_DATE]) {
    setEndDate(new Date((parsedData[LATEST_DATE])));
  }

  return ( 
    <div>
      <JsonFilePicker setJsonData={(data) => updateJsonDataFromFile(router, data) } />
      <EventPicker 
        eventNames={parsedData[ALL_EVENTS]} 
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent} />
      <EventPicker 
        eventNames={parsedData[ALL_STATES]} 
        selectedEvent={selectedState}
        setSelectedEvent={setSelectedState} />
      <SetDates 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate}
        setEndDate={setEndDate} />
      {
        parsedData[COUNT] > 0 
          ? <UserRowsFromEventList parsedData={parsedData} selectedEvent={selectedEvent} selectedState = {selectedState} />
          : null
      }
    </div>
  )
}

function updateJsonDataFromQueryParameter(router, setLoadingJson, setJsonData) {
  setLoadingJson(true);
  const base64Data = router.query[DATA_KEY];
  const JSZip = require("jszip");
  const newZip = new JSZip();
  newZip.loadAsync(base64Data, {base64: true})
    .then((zip) => {
      zip.file(ZIP_FILENAME)
        .async("string")
        .then((data) => {
          setLoadingJson(false);
          setJsonData(JSON.parse(data));
        });
    });
}


function updateJsonDataFromFile(router, jsonData) {
  const JSZip = require("jszip");
  const newZip = new JSZip();
  newZip.file(ZIP_FILENAME, jsonData).generateAsync({type: "base64"})
    .then(function(zipString) {
      router.push(
        { query: { ...router.query, [DATA_KEY]: zipString } },
        undefined,
        { shallow: true}
      );
    });
}

function useDateQueryParameter(router, key, defaultInitialValue) {
  var value = Date.parse(router.query[key]);
  if (!value) {
    value = Date.parse(defaultInitialValue);
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

function isCheckedInUser(rowIndex, columnIndex, parsedData, users, selected, mapKey) {
  const userStateMap = parsedData["users"][users[rowIndex]][mapKey]
  if (selected in userStateMap) {
    return userStateMap[selected][columnIndex] > 0;
  } else {
    return false;
  }
}


function UserRowsFromEventList({parsedData, selectedEvent, selectedState}) {
  const count = parsedData[COUNT];
  const users = Object.keys(parsedData[USERS]);
  const isColumnColored = (rowIndex, columnIndex) => {
    return isCheckedInUser(rowIndex, columnIndex, parsedData, users, selectedState, STATE_MAPS);
  };
  const isColumnChecked = (rowIndex, columnIndex) => {
    return isCheckedInUser(rowIndex, columnIndex, parsedData, users, selectedEvent, "event_maps");
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

