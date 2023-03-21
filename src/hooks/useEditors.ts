import React, { useState, createContext } from 'react';

export type EditorsContext = {
  hasActiveEditor: boolean;
  setActiveEditor: (active: boolean) => void;
}

export const Context = createContext<EditorsContext>({} as EditorsContext)

export function useEditors(): EditorsContext {
  const [hasActiveEditor, setActiveEditor] = useState(false);

  return {
    hasActiveEditor,
    setActiveEditor
  }
};
