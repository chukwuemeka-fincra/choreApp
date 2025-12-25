import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, generateId } from '../utils/constants';
import { getCurrentTimestamp } from '../utils/dateUtils';
import type { HistoryEntry, Chore, TeamMember } from '../types';

interface AddHistoryEntryParams {
  chore: Chore;
  completedBy: TeamMember | null;
  scheduledDate: string;
  notes?: string;
}

interface FilterParams {
  choreId?: string;
  memberId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UseHistoryReturn {
  history: HistoryEntry[];
  addHistoryEntry: (params: AddHistoryEntryParams) => HistoryEntry;
  removeHistoryEntry: (id: string) => void;
  getFilteredHistory: (params?: FilterParams) => HistoryEntry[];
  getChoreHistory: (choreId: string) => HistoryEntry[];
  getMemberHistory: (memberId: string) => HistoryEntry[];
  clearHistory: () => void;
  getRecentHistory: (count?: number) => HistoryEntry[];
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(STORAGE_KEYS.HISTORY, []);

  // Add a new history entry
  const addHistoryEntry = useCallback(
    ({ chore, completedBy, scheduledDate, notes = '' }: AddHistoryEntryParams): HistoryEntry => {
      const entry: HistoryEntry = {
        id: generateId('hist'),
        choreId: chore.id,
        choreTitle: chore.title,
        completedById: completedBy?.id || null,
        completedByName: completedBy?.name || 'Unknown',
        completedAt: getCurrentTimestamp(),
        scheduledDate,
        notes,
      };

      setHistory((prev) => [entry, ...prev]); // Add to beginning for recent first
      return entry;
    },
    [setHistory]
  );

  // Remove a history entry
  const removeHistoryEntry = useCallback(
    (id: string): void => {
      setHistory((prev) => prev.filter((entry) => entry.id !== id));
    },
    [setHistory]
  );

  // Get history filtered by various criteria
  const getFilteredHistory = useCallback(
    ({ choreId, memberId, startDate, endDate }: FilterParams = {}): HistoryEntry[] => {
      return history.filter((entry) => {
        if (choreId && entry.choreId !== choreId) return false;
        if (memberId && entry.completedById !== memberId) return false;
        if (startDate && entry.scheduledDate < startDate) return false;
        if (endDate && entry.scheduledDate > endDate) return false;
        return true;
      });
    },
    [history]
  );

  // Get history for a specific chore
  const getChoreHistory = useCallback(
    (choreId: string): HistoryEntry[] => {
      return history.filter((entry) => entry.choreId === choreId);
    },
    [history]
  );

  // Get history for a specific team member
  const getMemberHistory = useCallback(
    (memberId: string): HistoryEntry[] => {
      return history.filter((entry) => entry.completedById === memberId);
    },
    [history]
  );

  // Clear all history
  const clearHistory = useCallback((): void => {
    setHistory([]);
  }, [setHistory]);

  // Get recent history (last N entries)
  const getRecentHistory = useCallback(
    (count: number = 10): HistoryEntry[] => {
      return history.slice(0, count);
    },
    [history]
  );

  return {
    history,
    addHistoryEntry,
    removeHistoryEntry,
    getFilteredHistory,
    getChoreHistory,
    getMemberHistory,
    clearHistory,
    getRecentHistory,
  };
}
