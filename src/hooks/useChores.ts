import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, CHORE_COLORS, generateId, RECURRENCE_TYPES } from '../utils/constants';
import { getCurrentTimestamp, getCurrentDateString } from '../utils/dateUtils';
import type { Chore, ChoreFormData } from '../types';

export interface UseChoresReturn {
  chores: Chore[];
  addChore: (choreData: ChoreFormData) => Chore;
  updateChore: (id: string, updates: Partial<ChoreFormData>) => void;
  deleteChore: (id: string) => void;
  completeChore: (id: string, date?: string | null) => void;
  uncompleteChore: (id: string, date?: string | null) => void;
  isChoreCompleted: (chore: Chore | null, date?: string | null) => boolean;
  getChoreById: (id: string) => Chore | null;
  getChoresForMember: (memberId: string) => Chore[];
  getChoreCountForMember: (memberId: string) => number;
}

export function useChores(): UseChoresReturn {
  const [chores, setChores] = useLocalStorage<Chore[]>(STORAGE_KEYS.CHORES, []);

  // Get next available color
  const getNextColor = useCallback((): string => {
    return CHORE_COLORS[chores.length % CHORE_COLORS.length];
  }, [chores]);

  // Add a new chore
  const addChore = useCallback(
    (choreData: ChoreFormData): Chore => {
      const now = getCurrentTimestamp();
      const today = getCurrentDateString();
      const newChore: Chore = {
        id: generateId('chore'),
        title: choreData.title.trim(),
        description: choreData.description?.trim() || '',
        startDate: choreData.startDate || today,
        endDate: choreData.endDate || today,
        dueTime: choreData.dueTime || null,
        assigneeId: choreData.assigneeId || null,
        recurrence: choreData.recurrence || null,
        isCompleted: false,
        color: choreData.color || getNextColor(),
        createdAt: now,
        updatedAt: now,
        // Track completions for recurring chores by date
        completions: {},
      };

      setChores((prev) => [...prev, newChore]);
      return newChore;
    },
    [setChores, getNextColor]
  );

  // Update an existing chore
  const updateChore = useCallback(
    (id: string, updates: Partial<ChoreFormData>): void => {
      setChores((prev) =>
        prev.map((chore) => {
          if (chore.id !== id) return chore;
          return {
            ...chore,
            ...updates,
            updatedAt: getCurrentTimestamp(),
          };
        })
      );
    },
    [setChores]
  );

  // Delete a chore
  const deleteChore = useCallback(
    (id: string): void => {
      setChores((prev) => prev.filter((chore) => chore.id !== id));
    },
    [setChores]
  );

  // Complete a chore instance (handles recurring chores)
  const completeChore = useCallback(
    (id: string, date: string | null = null): void => {
      const dateKey = date || getCurrentDateString();
      setChores((prev) =>
        prev.map((chore) => {
          if (chore.id !== id) return chore;

          // For recurring chores, mark the specific date as completed
          if (chore.recurrence && chore.recurrence.type !== RECURRENCE_TYPES.NONE) {
            return {
              ...chore,
              completions: {
                ...chore.completions,
                [dateKey]: true,
              },
              updatedAt: getCurrentTimestamp(),
            };
          }

          // For non-recurring chores, mark as completed
          return {
            ...chore,
            isCompleted: true,
            updatedAt: getCurrentTimestamp(),
          };
        })
      );
    },
    [setChores]
  );

  // Uncomplete a chore instance
  const uncompleteChore = useCallback(
    (id: string, date: string | null = null): void => {
      const dateKey = date || getCurrentDateString();
      setChores((prev) =>
        prev.map((chore) => {
          if (chore.id !== id) return chore;

          // For recurring chores, remove the date from completions
          if (chore.recurrence && chore.recurrence.type !== RECURRENCE_TYPES.NONE) {
            const { [dateKey]: _, ...restCompletions } = chore.completions || {};
            return {
              ...chore,
              completions: restCompletions,
              updatedAt: getCurrentTimestamp(),
            };
          }

          // For non-recurring chores
          return {
            ...chore,
            isCompleted: false,
            updatedAt: getCurrentTimestamp(),
          };
        })
      );
    },
    [setChores]
  );

  // Check if a chore instance is completed
  const isChoreCompleted = useCallback(
    (chore: Chore | null, date: string | null = null): boolean => {
      if (!chore) return false;
      const dateKey = date || chore.endDate;

      if (chore.recurrence && chore.recurrence.type !== RECURRENCE_TYPES.NONE) {
        return chore.completions?.[dateKey] === true;
      }

      return chore.isCompleted;
    },
    []
  );

  // Get a single chore by ID
  const getChoreById = useCallback(
    (id: string): Chore | null => {
      return chores.find((chore) => chore.id === id) || null;
    },
    [chores]
  );

  // Get chores assigned to a specific member
  const getChoresForMember = useCallback(
    (memberId: string): Chore[] => {
      return chores.filter((chore) => chore.assigneeId === memberId);
    },
    [chores]
  );

  // Get count of chores assigned to a specific member
  const getChoreCountForMember = useCallback(
    (memberId: string): number => {
      return chores.filter((chore) => chore.assigneeId === memberId && !chore.isCompleted).length;
    },
    [chores]
  );

  return {
    chores,
    addChore,
    updateChore,
    deleteChore,
    completeChore,
    uncompleteChore,
    isChoreCompleted,
    getChoreById,
    getChoresForMember,
    getChoreCountForMember,
  };
}
