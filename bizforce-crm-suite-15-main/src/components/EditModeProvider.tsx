
import React, { createContext, useContext, useState } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  editableFields: Set<string>;
  addEditableField: (field: string) => void;
  removeEditableField: (field: string) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
};

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableFields, setEditableFields] = useState<Set<string>>(new Set());

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setEditableFields(new Set());
    }
  };

  const addEditableField = (field: string) => {
    setEditableFields(prev => new Set([...prev, field]));
  };

  const removeEditableField = (field: string) => {
    setEditableFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(field);
      return newSet;
    });
  };

  return (
    <EditModeContext.Provider value={{
      isEditMode,
      toggleEditMode,
      editableFields,
      addEditableField,
      removeEditableField
    }}>
      {children}
    </EditModeContext.Provider>
  );
};
