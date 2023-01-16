const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
// Dictionary of USER_ID -> EVENT_MAPS
export const USERS = "users";
// Key into USERS dictionary
export const USER_ID = "user_id";
// Dictionary of EVENT_ID -> dictionary of EVENT_ID to DAY_INDEX
export const EVENT_MAPS = "event_maps";
export const STATE_MAPS = "state_maps";
export const ALL_EVENTS = "all_events";
export const EVENT_TIME = "event_time";
export const STATE_TIME = "state_time";
export const USER_STATE = "user_state";
export const ALL_STATES = "all_states";
export const COUNT = "count";
export const EVENT_ID = "event_id";

export function parseEventList(list, startDate, endDate) {
  console.log("start " + startDate);
  console.log("end " + endDate);
  const allEvents = new Set();
  const allStates = new Set();
  const users = {};
  list.forEach(item => {
    const userId = item[USER_ID];
    if (!(userId in users)) {
      users[userId] = {[EVENT_MAPS]: {}, [STATE_MAPS]: {}};
    }
    if (EVENT_TIME in item) {
      parseEvent(startDate, endDate, allEvents, users, userId, item);
    } else if (STATE_TIME in item) {
      parseState(startDate, endDate, allStates, users, userId, item);
    }
  });
  return {
    [COUNT]: daysBetween(startDate, endDate), 
    [USERS]: users,
    [ALL_EVENTS]: allEvents,
    [ALL_STATES]: allStates,
  }
}

function parseState(startDate, endDate, allStates, users, userId, item) {
  const stateTime = Date.parse(item[STATE_TIME]);
  if (stateTime < startDate || stateTime > endDate) {
    return;
  }
  const userState = item[USER_STATE];
  allStates.add(userState);
  if (!(userState in users[userId][STATE_MAPS])) {
    users[userId][STATE_MAPS][userState] = {};
  }
  const dayIndex = daysBetween(startDate, stateTime);
  if (!(dayIndex in users[userId][STATE_MAPS][userState])) {
    users[userId][STATE_MAPS][userState][dayIndex] = 0;
  }
  users[userId][STATE_MAPS][userState][dayIndex]++;
}

function parseEvent(startDate, endDate, allEvents, users, userId, item) {
  const eventTime = Date.parse(item[EVENT_TIME]);
  if (eventTime < startDate || eventTime > endDate) {
    return;
  }
  const eventId = item[EVENT_ID];
  allEvents.add(eventId);
  if (!(eventId in users[userId][EVENT_MAPS])) {
    users[userId][EVENT_MAPS][eventId] = {};
  }
  const dayIndex = daysBetween(startDate, eventTime);
  if (!(dayIndex in users[userId][EVENT_MAPS][eventId])) {
    users[userId][EVENT_MAPS][eventId][dayIndex] = 0;
  }

  users[userId][EVENT_MAPS][eventId][dayIndex]++;
}


function asUtc(dateTime) {
  const result = new Date(dateTime)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  return Math.round((asUtc(endDate) - asUtc(startDate)) / MILLIS_PER_DAY)
}

