export function trim(text, len) {
  if (!text) return;
  if (text.length < len) {
    return text;
  }
  return text.substring(0, len) + '...';
}

export const secondsToMinutes = (SECONDS) => {
  const date = new Date(null);
  date.setSeconds(SECONDS); // specify value for SECONDS here
  return date.toISOString().substr(11, 8);
};

export const millisToStringLong = (MILLIS) => {
  const date = new Date(null);
  date.setMilliseconds(MILLIS); // specify value for SECONDS here
  return date.toISOString().substr(11, 12);
};


export const minutesToSeconds = (minutes) => {
  let [hours, mins, secs] = minutes.split(':');

  if (!secs) {
    secs = mins;
    mins = hours;
    hours = 0;
  }
  if (secs && secs.indexOf('.') > -1) {
    [secs] = secs.split('.');
    secs = parseInt(secs, 10)
  }
  hours = parseInt(hours, 10);
  mins = parseInt(mins, 10);
  secs = parseInt(secs, 10);
  return (hours * 60 * 60) + (mins * 60) + secs;
};


export const minutesToMillis = (minutes = '') => {
  debugger;
  return '';
  // let [hours, mins, secs] = minutes.split(':');
  //
  // if (!secs) {
  //   secs = mins;
  //   mins = hours;
  //   hours = 0;
  // }
  // let millis = 0;
  // if (secs && secs.indexOf('.') > -1) {
  //   [secs, millis] = secs.split('.');
  //   millis = parseInt(millis, 10);
  //   secs = parseInt(secs, 10)
  // }
  // hours = parseInt(hours, 10);
  // mins = parseInt(mins, 10);
  // secs = parseInt(secs, 10);
  // return (((hours * 60 * 60) + (mins * 60) + secs) * 1000) + millis;
};

export function roundSecondsDown(timeString) {
  let [hours, minutes, seconds ] = timeString.split(':');
  if (!seconds) {
    minutes = hours;
    seconds = minutes;
    hours = '00'
  }
  let second = (Math.floor(seconds/15) * 15) % 60;
  if (seconds >= 60) {
    second = '45';
  }
  second = second === 0 ? '00' : second;

  return `${hours}:${minutes}:${second}`;
}

export function getMinute(minute, diff) {
  // 0:00 -> 0:00
  // 1:00 -> 0:45
  // 3:34 -> 3:30

  const seconds = minutesToSeconds(minute);
  const updated = Math.max(seconds + diff, 0);
  return secondsToMinutes(updated);
}
// 1000000000 -> 00:10:00
export function millisToString(millis, forceSeconds = false) {

  if (!millis) {
    return forceSeconds
      ? '00:00:00'
      : '00:00';
  }

  let seconds = Math.floor((millis / 1000) % 60),
    minutes = Math.floor((millis / (1000 * 60)) % 60),
    hours = Math.floor((millis / (1000 * 60 * 60)) % 24);



  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  if (hours > 0 || forceSeconds) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;

}

const map = new Map();
export const getRedirectUrl = async (url) => {
  const cached = map.get(url);
  if (cached) {
    return cached;
  }
  try {
    const resp = await fetch(url, {method: 'HEAD'});
    map.set(url, resp.url);
    return resp.url;
  } catch (e) {
    console.log(e);
  }
  try {
    const resp = await fetch(url);
    map.set(url, resp.url);
    return resp.url;
  } catch(e) {
    //
    console.log(e);
  }
  return null;
};
