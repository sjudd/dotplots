import { DATA_LIST } from '../components/fake.js';
import { parseJsonData, COUNT, USERS, ALL_EVENTS, ALL_STATES, STATE_MAPS, EARLIEST_DATE, LATEST_DATE } from '../components/parse.js';
import UserRows from '../components/UserRows.js';
import SetDates from '../components/SetDates.js';
import EventPicker from '../components/EventPicker.js';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from "react";
import JsonFilePicker from '../components/JsonFilePicker.js';
import styles from '../styles/DotPlot.module.css';

const ZIP_FILENAME = "1";
const DATA_KEY = "data";
const EVENT_KEY = "event";
const STATE_KEY = "state";
const START_DATE_KEY = "start";
const END_DATE_KEY = "end";

export default function DotPlot() {
  const [ jsonData, setJsonData ] = useState(null);
  const [ compressedJsonData, setCompressedJsonData ] = useState(null);
  const [ isLoading, setLoading ] = useState(true);
  const [ isLoadingJson, setLoadingJson ] = useState(false);
  const [ selectedEvent, setSelectedEvent ] = useState(null);
  const [ selectedState, setSelectedState ] = useState(null);
  const [ startDate, setStartDate ] = useState(null);
  const [ endDate, setEndDate ] = useState(null);

  const router = useRouter();

  // Set initial state based on the URL.
  // Query parameters are populated after ReactDom.hydrate, so wait
  // for it to be ready before we try to read our params.
  useEffect(
    () => { 
      setLoading(!router.isReady)
      if (!router.isReady) {
        return;
      }
      if (!selectedEvent) {
        setSelectedEvent(router.query[EVENT_KEY]);
      }
      if (!selectedState) {
        setSelectedState(router.query[STATE_KEY]);
      }
      if (!startDate && router.query[START_DATE_KEY]) {
        setStartDate(new Date(router.query[START_DATE_KEY]));
      }
      if (!endDate && router.query[END_DATE_KEY]) {
        setEndDate(new Date(router.query[END_DATE_KEY]));
      }
      if (!jsonData && router.query[DATA_KEY]) {
        updateJsonDataFromQueryParameter(router, setLoadingJson, setJsonData);
      }
    }, 
    [router.isReady]
  );

  useEffect(
    () => {
      if (jsonData == null) {
        setCompressedJsonData(null);
        return;
      }
      console.log("Compress json");
      const JSZip = require("jszip");
      const newZip = new JSZip();
      newZip.file(ZIP_FILENAME, jsonData).generateAsync({type: "base64"})
        .then(function(zipString) {
          setCompressedJsonData(zipString);
        });
    },
    [jsonData]
  );

  // Update URL query parameters when state changes.
  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      const newValues = {};
      if (selectedEvent) {
        newValues[EVENT_KEY] = selectedEvent;
      }
      if (selectedState) {
        newValues[STATE_KEY] = selectedState;
      }
      if (startDate) {
        newValues[START_DATE_KEY] = startDate.toISOString();
      }
      if (endDate) {
        newValues[END_DATE_KEY] = endDate.toISOString();
      }
      if (compressedJsonData) {
        newValues[DATA_KEY] = compressedJsonData;
      }
      updateQueryParameters(router, newValues);
    },
    [router.isReady, selectedEvent, selectedState, startDate, endDate, compressedJsonData]
  );

  const parsedData = parseJsonData(jsonData == null ? [] : JSON.parse(jsonData)["events"], startDate, endDate);

  // Each time a new JSON file is selected, set some reasonable default values
  // for states that aren't explicitly set.
  useEffect(
    () => {
      if (!startDate && parsedData[EARLIEST_DATE]) {
        setStartDate(new Date(parsedData[EARLIEST_DATE]));
      }
      if (!endDate && parsedData[LATEST_DATE]) {
        setEndDate(new Date((parsedData[LATEST_DATE])));
      }
      if (!selectedEvent 
          && parsedData[ALL_EVENTS] 
          && parsedData[ALL_EVENTS].size > 0) {
        setSelectedEvent(parsedData[ALL_EVENTS].values().next().value);
      }
      if (!selectedState 
            && parsedData[ALL_STATES] 
            && parsedData[ALL_STATES].size > 0) {
        setSelectedState(parsedData[ALL_STATES].values().next().value);
      }
    }, 
    [jsonData]
  );

  if (isLoading || isLoadingJson) {
    // TODO: Figure out some more reasonable loading UI.
    return;
  }

  return ( 
    <div className={styles.parent}>
      <JsonFilePicker setJsonData={setJsonData} />
      <div className={styles.pickers}>
        <div>
          <b>User Events:</b>
          <EventPicker 
            className={styles.pickersitem}
            eventNames={parsedData[ALL_EVENTS]} 
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent} />
        </div>
        <div>
          <b>User States:</b>
          <EventPicker 
            className={styles.pickersitem}
            eventNames={parsedData[ALL_STATES]} 
            selectedEvent={selectedState}
            setSelectedEvent={setSelectedState} />
        </div>
      </div>
      <div className={styles.dates}>
        <SetDates 
          startDate={startDate} 
          setStartDate={setStartDate} 
          endDate={endDate}
          setEndDate={setEndDate} />
      </div>
      {
        parsedData[COUNT] > 0 
          ? <UserRowsFromEventList parsedData={parsedData} selectedEvent={selectedEvent} selectedState = {selectedState} />
          : null
      }
    </div>
  );
}

function updateQueryParameters(router, newValues) {
  router.push(
    { 
      query: newValues,
    }, 
    undefined, 
    { shallow: true}
  );
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
          setJsonData(data);
        });
    });
}

function isCheckedInUser(rowIndex, columnIndex, parsedData, users, selected, mapKey) {
  const userStateMap = parsedData["users"][users[rowIndex]][mapKey];
  return selected in userStateMap && userStateMap[selected][columnIndex] > 0;
}


function UserRowsFromEventList({parsedData, selectedEvent, selectedState}) {
  const count = parsedData[COUNT];
  const users = Object.keys(parsedData[USERS]);
  const isColumnColored = (rowIndex, columnIndex) => {
    return isCheckedInUser(rowIndex, columnIndex, parsedData, users, selectedState, STATE_MAPS);
  };
  const isColumnChecked = (rowIndex, columnIndex) => {
    return isCheckedInUser(rowIndex, columnIndex, parsedData, users, selectedEvent, "event_maps");
  };
  return ( 
      <UserRows 
        totalRows={users.length}
        totalColumns={count}
        isColumnChecked={isColumnChecked}
        isColumnColored={isColumnColored}
        userIndexToKey={(index) => users[index]}
      />
  );
}

