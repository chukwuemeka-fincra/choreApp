import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../common';
import { CHORE_COLORS, RECURRENCE_TYPES } from '../../utils/constants';
import { getCurrentDateString } from '../../utils/dateUtils';
import type { Chore, ChoreFormData, SelectOption, RecurrenceType } from '../../types';
import './ChoreForm.css';

const RECURRENCE_OPTIONS: SelectOption[] = [
  { value: RECURRENCE_TYPES.NONE, label: 'Does not repeat' },
  { value: RECURRENCE_TYPES.DAILY, label: 'Daily' },
  { value: RECURRENCE_TYPES.WEEKLY, label: 'Weekly' },
  { value: RECURRENCE_TYPES.MONTHLY, label: 'Monthly' },
];

interface ChoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (choreData: ChoreFormData) => void;
  onDelete?: (chore: Chore) => void;
  chore?: Chore | null;
  memberOptions?: SelectOption[];
}

interface FormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  dueTime: string;
  assigneeId: string;
  recurrenceType: RecurrenceType;
  color: string;
}

interface FormErrors {
  title?: string;
  startDate?: string;
  endDate?: string;
}

export function ChoreForm({
  isOpen,
  onClose,
  onSave,
  onDelete,
  chore = null,
  memberOptions = [],
}: ChoreFormProps) {
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    startDate: getCurrentDateString(),
    endDate: getCurrentDateString(),
    dueTime: '',
    assigneeId: '',
    recurrenceType: RECURRENCE_TYPES.NONE,
    color: CHORE_COLORS[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Reset form when modal opens/closes or chore changes
  useEffect(() => {
    if (isOpen) {
      if (chore) {
        setFormData({
          title: chore.title,
          description: chore.description || '',
          startDate: chore.startDate,
          endDate: chore.endDate,
          dueTime: chore.dueTime || '',
          assigneeId: chore.assigneeId || '',
          recurrenceType: (chore.recurrence?.type || RECURRENCE_TYPES.NONE) as RecurrenceType,
          color: chore.color,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          startDate: getCurrentDateString(),
          endDate: getCurrentDateString(),
          dueTime: '',
          assigneeId: '',
          recurrenceType: RECURRENCE_TYPES.NONE,
          color: CHORE_COLORS[0],
        });
      }
      setErrors({});
    }
  }, [isOpen, chore]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If start date is changed and is after end date, update end date
      if (name === 'startDate' && value > prev.endDate) {
        updated.endDate = value;
      }
      return updated;
    });
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const choreData: ChoreFormData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dueTime: formData.dueTime || null,
        assigneeId: formData.assigneeId || null,
        color: formData.color,
        recurrence:
          formData.recurrenceType !== RECURRENCE_TYPES.NONE
            ? { type: formData.recurrenceType, interval: 1 }
            : null,
      };
      onSave(choreData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (chore && onDelete) {
      onDelete(chore);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={chore ? 'Edit Chore' : 'Add Chore'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="chore-form">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details (optional)"
          rows={3}
        />

        <div className="form-row">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
          />

          <Input
            label="End Date (Due)"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            min={formData.startDate}
            required
          />
        </div>

        <div className="form-row">
          <Input
            label="Time"
            name="dueTime"
            type="time"
            value={formData.dueTime}
            onChange={handleChange}
          />

          <Select
            label="Repeat"
            name="recurrenceType"
            value={formData.recurrenceType}
            onChange={handleChange}
            options={RECURRENCE_OPTIONS}
          />
        </div>

        <Select
          label="Assign To"
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleChange}
          options={memberOptions}
          placeholder="Unassigned"
        />

        <div className="color-picker">
          <label className="color-picker-label">Color</label>
          <div className="color-options">
            {CHORE_COLORS.map((color) => (
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
          {chore && onDelete && (
            <Button
              variant="danger"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <div className="form-actions-right">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {chore ? 'Save Changes' : 'Add Chore'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
