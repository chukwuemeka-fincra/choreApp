import { formatDateRelative, formatDate } from '../../utils/dateUtils';
import type { HistoryEntry } from '../../types';
import './HistoryItem.css';

interface HistoryItemProps {
  entry: HistoryEntry;
  showChore?: boolean;
}

export function HistoryItem({ entry, showChore = true }: HistoryItemProps) {
  const completedDate = new Date(entry.completedAt);

  return (
    <div className="history-item">
      <div className="history-item-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
      <div className="history-item-content">
        {showChore && (
          <h4 className="history-item-title">{entry.choreTitle}</h4>
        )}
        <p className="history-item-meta">
          Completed by <strong>{entry.completedByName}</strong>
          {' on '}
          <span title={formatDate(completedDate, 'PPpp')}>
            {formatDateRelative(completedDate)}
          </span>
        </p>
        {entry.notes && (
          <p className="history-item-notes">{entry.notes}</p>
        )}
      </div>
      <div className="history-item-date">
        <span className="history-item-scheduled">
          Scheduled: {formatDate(entry.scheduledDate)}
        </span>
      </div>
    </div>
  );
}
