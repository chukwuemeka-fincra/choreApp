import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, MEMBER_COLORS, generateId, getInitials } from '../utils/constants';
import { getCurrentTimestamp } from '../utils/dateUtils';
import type { TeamMember, TeamMemberFormData, SelectOption } from '../types';

export interface UseTeamMembersReturn {
  members: TeamMember[];
  activeMembers: TeamMember[];
  memberOptions: SelectOption[];
  addMember: (memberData: TeamMemberFormData) => TeamMember;
  updateMember: (id: string, updates: Partial<TeamMemberFormData>) => void;
  removeMember: (id: string) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => TeamMember | null;
}

export function useTeamMembers(): UseTeamMembersReturn {
  const [members, setMembers] = useLocalStorage<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS, []);

  // Get next available color
  const getNextColor = useCallback((): string => {
    const usedColors = members.map((m) => m.color);
    const availableColor = MEMBER_COLORS.find((c) => !usedColors.includes(c));
    return availableColor || MEMBER_COLORS[members.length % MEMBER_COLORS.length];
  }, [members]);

  // Add a new team member
  const addMember = useCallback(
    (memberData: TeamMemberFormData): TeamMember => {
      const newMember: TeamMember = {
        id: generateId('member'),
        name: memberData.name.trim(),
        email: memberData.email?.trim() || '',
        color: memberData.color || getNextColor(),
        avatar: getInitials(memberData.name),
        isActive: true,
        createdAt: getCurrentTimestamp(),
      };

      setMembers((prev) => [...prev, newMember]);
      return newMember;
    },
    [setMembers, getNextColor]
  );

  // Update an existing team member
  const updateMember = useCallback(
    (id: string, updates: Partial<TeamMemberFormData>): void => {
      setMembers((prev) =>
        prev.map((member) => {
          if (member.id !== id) return member;
          const updatedMember = { ...member, ...updates };
          // Update avatar if name changed
          if (updates.name) {
            updatedMember.avatar = getInitials(updates.name);
          }
          return updatedMember;
        })
      );
    },
    [setMembers]
  );

  // Remove a team member (soft delete - set inactive)
  const removeMember = useCallback(
    (id: string): void => {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, isActive: false } : member
        )
      );
    },
    [setMembers]
  );

  // Permanently delete a team member
  const deleteMember = useCallback(
    (id: string): void => {
      setMembers((prev) => prev.filter((member) => member.id !== id));
    },
    [setMembers]
  );

  // Get a single member by ID
  const getMemberById = useCallback(
    (id: string): TeamMember | null => {
      return members.find((member) => member.id === id) || null;
    },
    [members]
  );

  // Get only active members
  const activeMembers = members.filter((m) => m.isActive);

  // Get member options for select dropdowns
  const memberOptions: SelectOption[] = activeMembers.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return {
    members,
    activeMembers,
    memberOptions,
    addMember,
    updateMember,
    removeMember,
    deleteMember,
    getMemberById,
  };
}
