// Recurrence pattern for chores
export interface RecurrencePattern {
  type: 'none' | 'daily' | 'weekly' | 'monthly';
  interval: number;
}

// Chore model
export interface Chore {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  dueTime: string | null;
  assigneeId: string | null;
  recurrence: RecurrencePattern | null;
  isCompleted: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
  completions: Record<string, boolean>;
}

// Team member model
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  color: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
}

// History entry model
export interface HistoryEntry {
  id: string;
  choreId: string;
  choreTitle: string;
  completedById: string | null;
  completedByName: string;
  completedAt: string;
  scheduledDate: string;
  notes: string;
}

// Form data types
export interface ChoreFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  dueTime: string | null;
  assigneeId: string | null;
  color: string;
  recurrence: RecurrencePattern | null;
}

export interface TeamMemberFormData {
  name: string;
  email: string;
  color: string;
}

// Select option type
export interface SelectOption {
  value: string;
  label: string;
}

// Calendar event instance
export interface ChoreInstance {
  date: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

// Calendar event for display
export interface CalendarEvent {
  id: string;
  choreId: string;
  title: string;
  start: Date;
  end: Date;
  date: string;
  chore: Chore;
  assignee: TeamMember | null;
  completed: boolean;
  color: string;
}
