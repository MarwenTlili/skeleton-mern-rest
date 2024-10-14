/**
 * get date and time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) in a specific time zone.
 * if no date specifyed it will return the current datetime.
 * 
 * @param locales string
 * @param timeZone string
 * @param date? Date
 * @returns string
 */
export const dateTimeISO8601 = (locales: string, timeZone: string, date?: Date): string => {
  const d = date ? date: new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
  };

  const localeDate = d.toLocaleString(locales, options);

  // Get milliseconds manually
  const milliseconds = d.getMilliseconds().toString().padStart(3, '0');

  // Split date and time parts
  const [datePart, timePart] = localeDate.split(', ');

  // Combine date, time, and milliseconds to match ISO 8601 format
  const isoDateTime = `${datePart}T${timePart}.${milliseconds}`;

  return isoDateTime;
};
