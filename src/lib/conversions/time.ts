/**
 * Time conversion utilities
 * Converts between Unix epoch timestamps and human-readable datetime formats
 */

export interface TimeConversionResult {
  unixSeconds: number;
  unixMilliseconds: number;
  localDatetime: string;
  utcDatetime: string;
  timezone: string;
  isDST: boolean;
}

/**
 * Get the current time in all supported formats
 */
export function getCurrentTime(): TimeConversionResult {
  const now = new Date();
  const unixMilliseconds = now.getTime();
  const unixSeconds = Math.floor(unixMilliseconds / 1000);

  // Format local datetime (ISO 8601 format without Z)
  const localDatetime = formatLocalDatetime(now);

  // Format UTC datetime (ISO 8601 format with Z)
  const utcDatetime = now.toISOString();

  // Get timezone info
  const { timezone, isDST } = getTimezoneInfo(now);

  return {
    unixSeconds,
    unixMilliseconds,
    localDatetime,
    utcDatetime,
    timezone,
    isDST,
  };
}

/**
 * Convert from Unix epoch seconds to all formats
 */
export function fromUnixSeconds(seconds: number): TimeConversionResult {
  const date = new Date(seconds * 1000);
  return convertDate(date);
}

/**
 * Convert from Unix epoch milliseconds to all formats
 */
export function fromUnixMilliseconds(milliseconds: number): TimeConversionResult {
  const date = new Date(milliseconds);
  return convertDate(date);
}

/**
 * Convert from local datetime string to all formats
 * @param datetimeString - ISO 8601 format datetime string (e.g., "2025-10-19T14:30:00")
 */
export function fromLocalDatetime(datetimeString: string): TimeConversionResult {
  const date = new Date(datetimeString);
  return convertDate(date);
}

/**
 * Convert from UTC datetime string to all formats
 * @param datetimeString - ISO 8601 format datetime string with Z (e.g., "2025-10-19T18:30:00.000Z")
 */
export function fromUTCDatetime(datetimeString: string): TimeConversionResult {
  const date = new Date(datetimeString);
  return convertDate(date);
}

/**
 * Convert a Date object to all time formats
 */
function convertDate(date: Date): TimeConversionResult {
  const unixMilliseconds = date.getTime();
  const unixSeconds = Math.floor(unixMilliseconds / 1000);
  const localDatetime = formatLocalDatetime(date);
  const utcDatetime = date.toISOString();
  const { timezone, isDST } = getTimezoneInfo(date);

  return {
    unixSeconds,
    unixMilliseconds,
    localDatetime,
    utcDatetime,
    timezone,
    isDST,
  };
}

/**
 * Format a Date object as local datetime in ISO 8601 format
 * Returns format: "YYYY-MM-DDTHH:mm:ss" (without timezone indicator)
 */
function formatLocalDatetime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Get timezone information for a given date
 */
function getTimezoneInfo(date: Date): { timezone: string; isDST: boolean } {
  // Get timezone abbreviation using Intl.DateTimeFormat
  const timezone =
    new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
    })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value || 'Unknown';

  // Detect DST by comparing timezone offsets in January and July
  const january = new Date(date.getFullYear(), 0, 1);
  const july = new Date(date.getFullYear(), 6, 1);
  const stdOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
  const isDST = date.getTimezoneOffset() < stdOffset;

  return { timezone, isDST };
}

/**
 * Validate if a string is a valid Unix epoch seconds value
 */
export function isValidUnixSeconds(value: string): boolean {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return false;

  // Unix timestamps are typically between 0 and a reasonable future date
  // Using year 2100 as upper bound: 4102444800
  return num >= 0 && num <= 4102444800;
}

/**
 * Validate if a string is a valid Unix epoch milliseconds value
 */
export function isValidUnixMilliseconds(value: string): boolean {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return false;

  // Unix timestamps in milliseconds, using year 2100 as upper bound
  return num >= 0 && num <= 4102444800000;
}

/**
 * Validate if a string is a valid datetime string
 */
export function isValidDatetime(value: string): boolean {
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Format Unix seconds for display (with commas for readability)
 */
export function formatUnixSeconds(seconds: number): string {
  return seconds.toLocaleString('en-US');
}

/**
 * Format Unix milliseconds for display (with commas for readability)
 */
export function formatUnixMilliseconds(milliseconds: number): string {
  return milliseconds.toLocaleString('en-US');
}

/**
 * Format local datetime for display
 * Returns format: "MMM DD, YYYY, HH:MM:SS TZ (DST/STD)"
 */
export function formatLocalDatetimeDisplay(datetime: string, timezone: string, isDST: boolean): string {
  const date = new Date(datetime);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
  };

  // Example output: "Oct 30, 2025, 21:53:31"
  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);
  const dstIndicator = isDST ? ' (DST)' : ' (STD)';

  return `${formatted} ${timezone}${dstIndicator}`;
}

/**
 * Format UTC datetime for display
 * Returns format: "MMM DD, YYYY at HH:MM:SS UTC"
 */
export function formatUTCDatetimeDisplay(datetime: string): string {
  const date = new Date(datetime);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  };

  const formatted = new Intl.DateTimeFormat('en-US', options).format(date);

  return `${formatted} UTC`;
}
