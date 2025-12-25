import { useState, type ChangeEvent } from 'react';
import { Select, Button, ConfirmDialog } from '../common';
import { HistoryItem } from './HistoryItem';
import type { HistoryEntry, SelectOption } from '../../types';
import './HistoryList.css';

interface HistoryListProps {
  history: HistoryEntry[];
  memberOptions: SelectOption[];
  onClearHistory: () => void;
}

export function HistoryList({
  history,
  memberOptions,
  onClearHistory,
}: HistoryListProps) {
  const [filterMember, setFilterMember] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = filterMember
    ? history.filter((entry) => entry.completedById === filterMember)
    : history;

  const handleMemberFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterMember(e.target.value);
  };

  return (
    <div className="history-list-container">
      <div className="history-list-header">
        <h2 className="history-list-title">Completion History</h2>
        <div className="history-list-actions">
          <Select
            value={filterMember}
            onChange={handleMemberFilterChange}
            options={memberOptions}
            placeholder="All members"
          />
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowClearConfirm(true)}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="history-list-empty">
          <p>No completion history yet.</p>
          <p>Complete chores to see them here.</p>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={onClearHistory}
        title="Clear History"
        message="Are you sure you want to clear all completion history? This cannot be undone."
        confirmText="Clear All"
      />
    </div>
  );
}
