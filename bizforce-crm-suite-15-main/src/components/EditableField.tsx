
import React, { useState, useRef, useEffect } from 'react';
import { useEditMode } from './EditModeProvider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit3, Check, X } from 'lucide-react';

interface EditableFieldProps {
  id: string;
  value: string | number;
  onSave: (value: string | number) => void;
  type?: 'text' | 'textarea' | 'number' | 'email' | 'phone';
  className?: string;
  children?: React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  id,
  value,
  onSave,
  type = 'text',
  className = '',
  children
}) => {
  const { isEditMode, editableFields, addEditableField, removeEditableField } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const isFieldEditable = editableFields.has(id);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    addEditableField(id);
  };

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
    removeEditableField(id);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    removeEditableField(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing && isEditMode) {
    return (
      <div className="flex items-center space-x-2 group">
        {type === 'textarea' ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={className}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={className}
          />
        )}
        <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {children || <span>{value}</span>}
      {isEditMode && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
