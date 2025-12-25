import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Modal, Button, Input } from '../common';
import { MEMBER_COLORS } from '../../utils/constants';
import type { TeamMember, TeamMemberFormData } from '../../types';
import './TeamMemberForm.css';

interface TeamMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: TeamMemberFormData) => void;
  member?: TeamMember | null;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export function TeamMemberForm({ isOpen, onClose, onSave, member = null }: TeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    email: '',
    color: MEMBER_COLORS[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when modal opens/closes or member changes
  useEffect(() => {
    if (isOpen) {
      if (member) {
        setFormData({
          name: member.name,
          email: member.email || '',
          color: member.color,
        });
      } else {
        setFormData({
          name: '',
          email: '',
          color: MEMBER_COLORS[0],
        });
      }
      setErrors({});
    }
  }, [isOpen, member]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Edit Team Member' : 'Add Team Member'}
      size="small"
    >
      <form onSubmit={handleSubmit} className="team-member-form">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          error={errors.name}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email (optional)"
          error={errors.email}
        />

        <div className="color-picker">
          <label className="color-picker-label">Color</label>
          <div className="color-options">
            {MEMBER_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${
                  formData.color === color ? 'color-option--selected' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {member ? 'Save Changes' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
