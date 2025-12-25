import { useState } from 'react';
import { Button, ConfirmDialog } from '../common';
import { ChoreCard } from './ChoreCard';
import { ChoreForm } from './ChoreForm';
import type { Chore, TeamMember, ChoreFormData, SelectOption } from '../../types';
import './ChoreList.css';

interface ChoreListProps {
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

export function ChoreList({
  chores,
  memberOptions,
  onAddChore,
  onUpdateChore,
  onDeleteChore,
  onCompleteChore,
  isChoreCompleted,
  getMemberById,
}: ChoreListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [choreToDelete, setChoreToDelete] = useState<Chore | null>(null);

  const handleAddClick = () => {
    setEditingChore(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (chore: Chore) => {
    setEditingChore(chore);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (chore: Chore) => {
    setChoreToDelete(chore);
  };

  const handleFormSave = (formData: ChoreFormData) => {
    if (editingChore) {
      onUpdateChore(editingChore.id, formData);
    } else {
      onAddChore(formData);
    }
  };

  const handleFormDelete = (chore: Chore) => {
    setChoreToDelete(chore);
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (choreToDelete) {
      onDeleteChore(choreToDelete.id);
    }
  };

  const handleComplete = (chore: Chore, date: string) => {
    const completed = isChoreCompleted(chore, date);
    onCompleteChore(chore.id, date, !completed);
  };

  // Sort chores by date, then by completion status
  const sortedChores = [...chores].sort((a, b) => {
    const aCompleted = isChoreCompleted(a, a.endDate);
    const bCompleted = isChoreCompleted(b, b.endDate);
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
  });

  return (
    <div className="chore-list-container">
      <div className="chore-list-header">
        <h2 className="chore-list-title">Chores</h2>
        <Button onClick={handleAddClick}>Add Chore</Button>
      </div>

      {chores.length === 0 ? (
        <div className="chore-list-empty">
          <p>No chores yet.</p>
          <p>Add your first chore to get started.</p>
        </div>
      ) : (
        <div className="chore-list">
          {sortedChores.map((chore) => (
            <ChoreCard
              key={chore.id}
              chore={chore}
              assignee={chore.assigneeId ? getMemberById(chore.assigneeId) : null}
              isCompleted={isChoreCompleted(chore, chore.endDate)}
              onEdit={handleEditClick}
              onComplete={handleComplete}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <ChoreForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        onDelete={handleFormDelete}
        chore={editingChore}
        memberOptions={memberOptions}
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
