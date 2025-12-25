import { useState } from 'react';
import { Button, ConfirmDialog } from '../common';
import { TeamMemberCard } from './TeamMemberCard';
import { TeamMemberForm } from './TeamMemberForm';
import type { TeamMember, TeamMemberFormData } from '../../types';
import './TeamList.css';

interface TeamListProps {
  members: TeamMember[];
  onAddMember: (memberData: TeamMemberFormData) => void;
  onUpdateMember: (id: string, updates: Partial<TeamMemberFormData>) => void;
  onRemoveMember: (id: string) => void;
  getChoreCountForMember?: (memberId: string) => number;
}

export function TeamList({
  members,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  getChoreCountForMember = () => 0,
}: TeamListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const handleAddClick = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleRemoveClick = (member: TeamMember) => {
    setMemberToRemove(member);
  };

  const handleFormSave = (formData: TeamMemberFormData) => {
    if (editingMember) {
      onUpdateMember(editingMember.id, formData);
    } else {
      onAddMember(formData);
    }
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove.id);
    }
  };

  return (
    <div className="team-list-container">
      <div className="team-list-header">
        <h2 className="team-list-title">Team Members</h2>
        <Button onClick={handleAddClick}>Add Member</Button>
      </div>

      {members.length === 0 ? (
        <div className="team-list-empty">
          <p>No team members yet.</p>
          <p>Add your first team member to start assigning chores.</p>
        </div>
      ) : (
        <div className="team-list">
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              choreCount={getChoreCountForMember(member.id)}
              onEdit={handleEditClick}
              onRemove={handleRemoveClick}
            />
          ))}
        </div>
      )}

      <TeamMemberForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        member={editingMember}
      />

      <ConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${memberToRemove?.name}? Their assigned chores will become unassigned.`}
        confirmText="Remove"
      />
    </div>
  );
}
