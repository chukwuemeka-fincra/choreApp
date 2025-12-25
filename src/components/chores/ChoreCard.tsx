import { Button } from '../common';
import { formatDateRelative, formatTime } from '../../utils/dateUtils';
import { RECURRENCE_TYPES } from '../../utils/constants';
import type { Chore, TeamMember, RecurrencePattern } from '../../types';
import './ChoreCard.css';

interface ChoreCardProps {
  chore: Chore;
  assignee: TeamMember | null;
  isCompleted: boolean;
  onEdit: (chore: Chore) => void;
  onComplete: (chore: Chore, date: string) => void;
  onDelete: (chore: Chore) => void;
  instanceDate?: string;
}

export function ChoreCard({
  chore,
  assignee,
  isCompleted,
  onEdit,
  onComplete,
  onDelete,
  instanceDate,
}: ChoreCardProps) {
  const getRecurrenceLabel = (recurrence: RecurrencePattern | null): string | null => {
    if (!recurrence || recurrence.type === RECURRENCE_TYPES.NONE) return null;
    switch (recurrence.type) {
      case RECURRENCE_TYPES.DAILY:
        return 'Daily';
      case RECURRENCE_TYPES.WEEKLY:
        return 'Weekly';
      case RECURRENCE_TYPES.MONTHLY:
        return 'Monthly';
      default:
        return null;
    }
  };

  const recurrenceLabel = getRecurrenceLabel(chore.recurrence);
  const displayDate = instanceDate || chore.endDate;
  const showDateRange = chore.startDate !== chore.endDate;

  return (
    <div className={`chore-card ${isCompleted ? 'chore-card--completed' : ''}`}>
      <div className="chore-card-main">
        <button
          type="button"
          className={`chore-checkbox ${isCompleted ? 'chore-checkbox--checked' : ''}`}
          onClick={() => onComplete(chore, displayDate)}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          style={{ borderColor: chore.color }}
        >
          {isCompleted && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7" />
            </svg>
          )}
        </button>

        <div className="chore-card-content">
          <h3 className="chore-title">{chore.title}</h3>
          {chore.description && (
            <p className="chore-description">{chore.description}</p>
          )}
          <div className="chore-meta">
            {showDateRange ? (
              <span className="chore-date">
                {formatDateRelative(chore.startDate)} - {formatDateRelative(chore.endDate)}
              </span>
            ) : (
              <span className="chore-date">Due: {formatDateRelative(displayDate)}</span>
            )}
            {chore.dueTime && (
              <span className="chore-time">{formatTime(chore.dueTime)}</span>
            )}
            {recurrenceLabel && (
              <span className="chore-recurrence">{recurrenceLabel}</span>
            )}
            {assignee && (
              <span
                className="chore-assignee"
                style={{ backgroundColor: assignee.color }}
              >
                {assignee.avatar}
              </span>
            )}
          </div>
        </div>

        <div
          className="chore-color-bar"
          style={{ backgroundColor: chore.color }}
        />
      </div>

      <div className="chore-card-actions">
        <Button variant="ghost" size="small" onClick={() => onEdit(chore)}>
          Edit
        </Button>
        <Button variant="ghost" size="small" onClick={() => onDelete(chore)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
