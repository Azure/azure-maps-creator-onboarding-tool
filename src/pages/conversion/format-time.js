export function formatProgressTime(startTime, endTime) {
  if (typeof startTime !== 'number' || isNaN(startTime)) {
    return '';
  }

  const diff = typeof endTime === 'number' && !isNaN(endTime) ? endTime - startTime : Date.now() - startTime;
  const totalSeconds = parseInt(diff / 1000, 10);

  if (totalSeconds <= 0) {
    return '';
  }

  const hours = Math.floor(totalSeconds / 3600);
  let remainingSeconds = totalSeconds - hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds -= minutes * 60;

  let out = '~';
  if (hours > 0) {
    out += `${hours}h`;
  }
  if (minutes > 0) {
    if (hours > 0) {
      out += ' ';
    }
    out += `${minutes}m`;
  }
  if (remainingSeconds > 0) {
    if (hours > 0 || minutes > 0) {
      out += ' ';
    }
    out += `${remainingSeconds}s`;
  }

  return out;
}
