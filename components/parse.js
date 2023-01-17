const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
// Dictionary of USER_ID -> EVENT_MAPS
export const USERS = "users";
// Key into USERS dictionary
export const USER_ID = "user_id";
// Dictionary of EVENT_ID -> dictionary of EVENT_ID to DAY_INDEX
export const EVENT_MAPS = "event_maps";
export const STATE_MAPS = "state_maps";
export const ALL_EVENTS = "all_events";
export const USER_STATE = "user_state";
export const ALL_STATES = "all_states";
export const COUNT = "count";
export const EVENT_ID = "event_id";
export const EARLIEST_DATE = "earliest_date";
export const LATEST_DATE = "latest_date";
export const TIME = "time";

export function parseJsonData(list, startDate, endDate) {
  const allEvents = new Set();
  const allStates = new Set();
  const users = {};
  var minTime = null;
  var maxTime = null;
  list.forEach(item => {
    const time = Date.parse(item[TIME]);
    if (startDate && time < startDate) {
      return;
    }
    if (endDate && time > endDate) {
      return;
    }
    if (minTime == null || minTime > time) {
      minTime = time;
    }
    if (maxTime == null || maxTime < time) {
      maxTime = time;
    }

    const userId = item[USER_ID];
    if (!(userId in users)) {
      users[userId] = {[EVENT_MAPS]: {}, [STATE_MAPS]: {}};
    }
    if (EVENT_ID in item) {
      parseEvent(startDate, endDate, allEvents, users, userId, time, item);
    } else if (USER_STATE in item) {
      parseState(startDate, endDate, allStates, users, userId, time, item);
    }
  });
  return {
    [COUNT]: daysBetween(startDate, endDate), 
    [USERS]: users,
    [ALL_EVENTS]: allEvents,
    [ALL_STATES]: allStates,
    [EARLIEST_DATE]: minTime,
    [LATEST_DATE]: maxTime,
  }
}

function parseState(startDate, endDate, allStates, users, userId, itemTime, item) {
  const userState = item[USER_STATE];
  allStates.add(userState);
  if (!(userState in users[userId][STATE_MAPS])) {
    users[userId][STATE_MAPS][userState] = {};
  }
  const dayIndex = daysBetween(startDate, itemTime);
  if (!(dayIndex in users[userId][STATE_MAPS][userState])) {
    users[userId][STATE_MAPS][userState][dayIndex] = 0;
  }
  users[userId][STATE_MAPS][userState][dayIndex]++;
}

function parseEvent(startDate, endDate, allEvents, users, userId, itemTime, item) {
  const eventId = item[EVENT_ID];
  allEvents.add(eventId);
  if (!(eventId in users[userId][EVENT_MAPS])) {
    users[userId][EVENT_MAPS][eventId] = {};
  }
  const dayIndex = daysBetween(startDate, itemTime);
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

