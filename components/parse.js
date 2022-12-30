const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
// Dictionary of USER_ID -> EVENT_MAPS
export const USERS = "users";
// Key into USERS dictionary
export const USER_ID = "user_id";
// Dictionary of EVENT_ID -> dictionary of EVENT_ID to DAY_INDEX
export const EVENT_MAPS = "event_maps";

export function parseEventList(list, startDate, endDate) {
  console.log("start " + startDate);
  console.log("end " + endDate);
  const users = {};
  list.forEach(item => {
    const userId = item[USER_ID];
    if (!(userId in users)) {
      users[userId] = {[EVENT_MAPS]: {}};
    }
    const eventTime = Date.parse(item["event_time"]);
    console.log("eventTime" + eventTime);
    if (eventTime > startDate && eventTime < endDate) {
      const eventId = item["event_id"];
      if (!(eventId in users[userId][EVENT_MAPS])) {
        users[userId][EVENT_MAPS][eventId] = {};
      }
      const dayIndex = daysBetween(startDate, eventTime);
      if (!(dayIndex in users[userId][EVENT_MAPS][eventId])) {
        users[userId][EVENT_MAPS][eventId][dayIndex] = 0;
      }

      users[userId][EVENT_MAPS][eventId][dayIndex]++;
    }
  })
  return {"count": daysBetween(startDate, endDate), [USERS]: users}
}

function asUtc(dateTime) {
  const result = new Date(dateTime)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  return Math.round((asUtc(endDate) - asUtc(startDate)) / MILLIS_PER_DAY)
}

