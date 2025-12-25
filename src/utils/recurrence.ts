import {
  addDays,
  addWeeks,
  addMonths,
  parseISO,
  isWithinInterval,
  format,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
} from 'date-fns';
import { RECURRENCE_TYPES } from './constants';
import type { Chore, RecurrencePattern, ChoreInstance } from '../types';

/**
 * Generate all instances of a chore within a date range
 * For recurring chores, generates instances from startDate to endDate
 * For non-recurring chores, returns single instance on endDate (due date) if within range
 */
export function generateRecurringInstances(
  chore: Chore,
  rangeStart: Date,
  rangeEnd: Date
): ChoreInstance[] {
  const instances: ChoreInstance[] = [];

  // Handle missing dates - fallback to endDate for startDate if not present
  if (!chore.endDate) {
    return instances; // Can't generate instances without at least an end date
  }

  const choreEndDate = parseISO(chore.endDate);
  const choreStartDate = chore.startDate ? parseISO(chore.startDate) : choreEndDate;

  // If no recurrence or recurrence is 'none', show on the end date (due date)
  if (!chore.recurrence || chore.recurrence.type === RECURRENCE_TYPES.NONE) {
    if (isWithinInterval(choreEndDate, { start: rangeStart, end: rangeEnd })) {
      instances.push(createInstance(chore, choreEndDate));
    }
    return instances;
  }

  // For recurring chores: generate instances from startDate to endDate
  // The chore's endDate is the final date for recurrence
  const effectiveEnd = isBefore(choreEndDate, rangeEnd) ? choreEndDate : rangeEnd;

  // Find the first occurrence on or after rangeStart
  let currentDate = choreStartDate;

  // If the chore start date is after the effective end, no instances
  if (isAfter(choreStartDate, effectiveEnd)) {
    return instances;
  }

  // Move forward to the first date within our range
  while (isBefore(currentDate, rangeStart)) {
    currentDate = getNextOccurrence(currentDate, chore.recurrence);
    // Safety check to prevent infinite loop
    if (isAfter(currentDate, effectiveEnd)) {
      return instances;
    }
  }

  // Generate instances within the range (from startDate to endDate)
  const maxInstances = 100; // Safety limit
  let count = 0;

  while (!isAfter(currentDate, effectiveEnd) && count < maxInstances) {
    instances.push(createInstance(chore, currentDate));
    currentDate = getNextOccurrence(currentDate, chore.recurrence);
    count++;
  }

  return instances;
}

/**
 * Create a calendar event instance from a chore and date
 */
function createInstance(chore: Chore, date: Date): ChoreInstance {
  const dateStr = format(date, 'yyyy-MM-dd');

  let start: Date, end: Date;

  if (chore.dueTime) {
    const [hours, minutes] = chore.dueTime.split(':').map(Number);
    start = new Date(date);
    start.setHours(hours, minutes, 0, 0);
    end = new Date(start);
    end.setHours(hours + 1); // Default 1 hour duration
  } else {
    // All-day event
    start = startOfDay(date);
    end = endOfDay(date);
  }

  return {
    date: dateStr,
    start,
    end,
    allDay: !chore.dueTime,
  };
}

/**
 * Get the next occurrence date based on recurrence pattern
 */
function getNextOccurrence(date: Date, recurrence: RecurrencePattern): Date {
  const interval = recurrence.interval || 1;

  switch (recurrence.type) {
    case RECURRENCE_TYPES.DAILY:
      return addDays(date, interval);
    case RECURRENCE_TYPES.WEEKLY:
      return addWeeks(date, interval);
    case RECURRENCE_TYPES.MONTHLY:
      return addMonths(date, interval);
    default:
      return addDays(date, 1);
  }
}

/**
 * Get a human-readable description of the recurrence pattern
 */
export function getRecurrenceDescription(recurrence: RecurrencePattern | null): string {
  if (!recurrence || recurrence.type === RECURRENCE_TYPES.NONE) {
    return 'Does not repeat';
  }

  const interval = recurrence.interval || 1;

  switch (recurrence.type) {
    case RECURRENCE_TYPES.DAILY:
      return interval === 1 ? 'Daily' : `Every ${interval} days`;
    case RECURRENCE_TYPES.WEEKLY:
      return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
    case RECURRENCE_TYPES.MONTHLY:
      return interval === 1 ? 'Monthly' : `Every ${interval} months`;
    default:
      return 'Unknown';
  }
}
