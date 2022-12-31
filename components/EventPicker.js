import { useEffect, useState } from 'react';

export default function EventPicker({ eventNames, selectedEvent, setSelectedEvent }) {
  return (
    <table>
      <tbody>
      {
        [...eventNames].map(
          eventName => 
            <SingleEventRow 
              key={eventName} 
              eventName={eventName} 
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
        )
      }
      </tbody>
    </table>
  )
}

function SingleEventRow({ eventName, selectedEvent, setSelectedEvent }) {
  const onChange = event => {
    if (event.target.checked) {
      setSelectedEvent(eventName);
    } else {
      setSelectedEvent("");
    }
  }

  return (
    <tr>
      <td>
        {eventName}
      </td>
      <td>
        <label>
          <input 
            type="checkbox" 
            checked={eventName == selectedEvent}
            onChange={onChange}
          />
        </label>
      </td>
    </tr>
  )
}
