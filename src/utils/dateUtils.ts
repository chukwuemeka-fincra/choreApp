import { format, parseISO, isToday, isTomorrow, isYesterday, startOfDay, endOfDay } from 'date-fns';

type DateInput = string | Date;

// Format date for display
export const formatDate = (date: DateInput, formatStr: string = 'MMM d, yyyy'): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// Format time for display
export const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Format date with relative labels
export const formatDateRelative = (date: DateInput): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';

  return formatDate(dateObj);
};

// Get date string in YYYY-MM-DD format
export const toDateString = (date: DateInput): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

// Get start of day
export const getStartOfDay = (date: DateInput): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(dateObj);
};

// Get end of day
export const getEndOfDay = (date: DateInput): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(dateObj);
};

// Create a Date object from date string and optional time
export const createDateTime = (dateStr: string, timeStr: string | null = null): Date => {
  const date = parseISO(dateStr);
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':');
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  }
  return date;
};

// Get current date string
export const getCurrentDateString = (): string => {
  return toDateString(new Date());
};

// Get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
