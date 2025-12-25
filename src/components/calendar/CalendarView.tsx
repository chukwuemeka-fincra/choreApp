import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, type View, type SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { ChoreForm } from '../chores/ChoreForm';
import { ConfirmDialog } from '../common';
import { generateRecurringInstances } from '../../utils/recurrence';
import { toDateString } from '../../utils/dateUtils';
import type { Chore, TeamMember, ChoreFormData, SelectOption, CalendarEvent } from '../../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarViewProps {
  chores: Chore[];
  members: TeamMember[];
  memberOptions: SelectOption[];
  onAddChore: (choreData: ChoreFormData) => void;
  onUpdateChore: (id: string, updates: Partial<ChoreFormData>) => void;
  onDeleteChore: (id: string) => void;
  onCompleteChore: (choreId: string, date: string, shouldComplete: boolean) => void;
  isChoreCompleted: (chore: Chore | null, date?: string | null) => boolean;
  getMemberById: (id: string) => TeamMember | null;
}

interface EventComponentProps {
  event: CalendarEvent;
}

export function CalendarView({
  chores,
  memberOptions,
  onAddChore,
  onUpdateChore,
  onDeleteChore,
  isChoreCompleted,
  getMemberById,
}: CalendarViewProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [choreToDelete, setChoreToDelete] = useState<Chore | null>(null);

  // Convert chores to calendar events
  const events = useMemo((): CalendarEvent[] => {
    const allEvents: CalendarEvent[] = [];

    chores.forEach((chore) => {
      // Get instances for this chore (handles recurring)
      const instances = generateRecurringInstances(
        chore,
        new Date(date.getFullYear(), date.getMonth() - 1, 1),
        new Date(date.getFullYear(), date.getMonth() + 2, 0)
      );

      instances.forEach((instance) => {
        const assignee = chore.assigneeId ? getMemberById(chore.assigneeId) : null;
        const completed = isChoreCompleted(chore, instance.date);

        allEvents.push({
          id: `${chore.id}-${instance.date}`,
          choreId: chore.id,
          title: chore.title,
          start: instance.start,
          end: instance.end,
          date: instance.date,
          chore,
          assignee,
          completed,
          color: assignee?.color || chore.color,
        });
      });
    });

    return allEvents;
  }, [chores, date, getMemberById, isChoreCompleted]);

  // Event styling
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.completed ? '#9e9e9e' : event.color,
        borderRadius: '4px',
        opacity: event.completed ? 0.6 : 1,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        textDecoration: event.completed ? 'line-through' : 'none',
      },
    };
  }, []);

  // Handle clicking on an event
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setEditingChore(event.chore);
    setSelectedDate(event.date);
    setIsFormOpen(true);
  }, []);

  // Handle clicking on a slot (empty day/time)
  const handleSelectSlot = useCallback(({ start }: SlotInfo) => {
    setEditingChore(null);
    setSelectedDate(toDateString(start));
    // Extract time if not midnight (indicates a time slot was clicked in week/day view)
    const hours = start.getHours();
    const minutes = start.getMinutes();
    if (hours !== 0 || minutes !== 0) {
      setSelectedTime(format(start, 'HH:mm'));
    } else {
      setSelectedTime(null);
    }
    setIsFormOpen(true);
  }, []);

  // Handle form save
  const handleFormSave = (formData: ChoreFormData) => {
    if (editingChore) {
      onUpdateChore(editingChore.id, formData);
    } else {
      // Use the selected date for new chores
      onAddChore({ ...formData, endDate: selectedDate || formData.endDate });
    }
  };

  // Handle form delete
  const handleFormDelete = (chore: Chore) => {
    setChoreToDelete(chore);
    setIsFormOpen(false);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (choreToDelete) {
      onDeleteChore(choreToDelete.id);
    }
  };

  // Format time from "HH:mm" to "h:mm a" (e.g., "14:30" -> "2:30 PM")
  const formatTime = (time: string | null): string | null => {
    if (!time) return null;
    const parsed = parse(time, 'HH:mm', new Date());
    return format(parsed, 'h:mm a');
  };

  // Custom event component
  const EventComponent = ({ event }: EventComponentProps) => {
    const timeDisplay = formatTime(event.chore.dueTime);
    return (
      <div className="calendar-event">
        {timeDisplay && <span className="calendar-event-time">{timeDisplay}</span>}
        <span className="calendar-event-title">{event.title}</span>
        {event.assignee && (
          <span
            className="calendar-event-avatar"
            style={{ backgroundColor: event.assignee.color }}
          >
            {event.assignee.avatar}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={['month', 'week', 'day', 'agenda']}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
        }}
        popup
        showMultiDayTimes
      />

      <ChoreForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        onDelete={handleFormDelete}
        chore={editingChore}
        memberOptions={memberOptions}
        initialDate={selectedDate}
        initialTime={selectedTime}
      />

      <ConfirmDialog
        isOpen={!!choreToDelete}
        onClose={() => setChoreToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Chore"
        message={`Are you sure you want to delete "${choreToDelete?.title}"?`}
        confirmText="Delete"
      />
    </div>
  );
}
