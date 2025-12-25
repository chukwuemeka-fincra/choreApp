import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useChores } from '../hooks/useChores';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { useHistory } from '../hooks/useHistory';
import type { Chore, ChoreFormData, TeamMember, TeamMemberFormData, HistoryEntry, SelectOption } from '../types';

interface AppContextValue {
  // Chores
  chores: Chore[];
  addChore: (choreData: ChoreFormData) => Chore;
  updateChore: (id: string, updates: Partial<ChoreFormData>) => void;
  deleteChore: (id: string) => void;
  completeChore: (choreId: string, date: string | null, shouldComplete?: boolean) => void;
  isChoreCompleted: (chore: Chore | null, date?: string | null) => boolean;
  getChoreById: (id: string) => Chore | null;
  getChoreCountForMember: (memberId: string) => number;

  // Team Members
  members: TeamMember[];
  activeMembers: TeamMember[];
  memberOptions: SelectOption[];
  addMember: (memberData: TeamMemberFormData) => TeamMember;
  updateMember: (id: string, updates: Partial<TeamMemberFormData>) => void;
  removeMember: (id: string) => void;
  getMemberById: (id: string) => TeamMember | null;

  // History
  history: HistoryEntry[];
  clearHistory: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const choreHook = useChores();
  const teamHook = useTeamMembers();
  const historyHook = useHistory();

  // Enhanced complete chore that also adds to history
  const completeChoreWithHistory = useCallback(
    (choreId: string, date: string | null, shouldComplete: boolean = true) => {
      const chore = choreHook.getChoreById(choreId);
      if (!chore) return;

      if (shouldComplete) {
        // Add to history
        const assignee = chore.assigneeId
          ? teamHook.getMemberById(chore.assigneeId)
          : null;

        historyHook.addHistoryEntry({
          chore,
          completedBy: assignee,
          scheduledDate: date || chore.endDate,
        });

        // Mark as complete
        choreHook.completeChore(choreId, date);
      } else {
        // Uncomplete
        choreHook.uncompleteChore(choreId, date);
      }
    },
    [choreHook, teamHook, historyHook]
  );

  const value: AppContextValue = {
    // Chores
    chores: choreHook.chores,
    addChore: choreHook.addChore,
    updateChore: choreHook.updateChore,
    deleteChore: choreHook.deleteChore,
    completeChore: completeChoreWithHistory,
    isChoreCompleted: choreHook.isChoreCompleted,
    getChoreById: choreHook.getChoreById,
    getChoreCountForMember: choreHook.getChoreCountForMember,

    // Team Members
    members: teamHook.members,
    activeMembers: teamHook.activeMembers,
    memberOptions: teamHook.memberOptions,
    addMember: teamHook.addMember,
    updateMember: teamHook.updateMember,
    removeMember: teamHook.removeMember,
    getMemberById: teamHook.getMemberById,

    // History
    history: historyHook.history,
    clearHistory: historyHook.clearHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
