import { Button } from '../common';
import type { TeamMember } from '../../types';
import './TeamMemberCard.css';

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
  choreCount?: number;
}

export function TeamMemberCard({ member, onEdit, onRemove, choreCount = 0 }: TeamMemberCardProps) {
  return (
    <div className="team-member-card">
      <div
        className="team-member-avatar"
        style={{ backgroundColor: member.color }}
      >
        {member.avatar}
      </div>
      <div className="team-member-info">
        <h3 className="team-member-name">{member.name}</h3>
        {member.email && (
          <p className="team-member-email">{member.email}</p>
        )}
        <p className="team-member-chores">
          {choreCount} {choreCount === 1 ? 'chore' : 'chores'} assigned
        </p>
      </div>
      <div className="team-member-actions">
        <Button variant="ghost" size="small" onClick={() => onEdit(member)}>
          Edit
        </Button>
        <Button variant="ghost" size="small" onClick={() => onRemove(member)}>
          Remove
        </Button>
      </div>
    </div>
  );
}
