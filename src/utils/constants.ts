// localStorage keys
export const STORAGE_KEYS = {
  CHORES: 'choreApp_chores',
  TEAM_MEMBERS: 'choreApp_members',
  HISTORY: 'choreApp_history',
  SETTINGS: 'choreApp_settings',
} as const;

// Recurrence types
export const RECURRENCE_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export type RecurrenceType = typeof RECURRENCE_TYPES[keyof typeof RECURRENCE_TYPES];

// Default colors for team members
export const MEMBER_COLORS: string[] = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#FF5722', // Deep Orange
  '#3F51B5', // Indigo
  '#009688', // Teal
  '#795548', // Brown
];

// Default colors for chores
export const CHORE_COLORS: string[] = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#f44336', // Red
  '#00BCD4', // Cyan
];

// Calendar view options
export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda',
} as const;

// Generate a unique ID
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get initials from a name
export const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
