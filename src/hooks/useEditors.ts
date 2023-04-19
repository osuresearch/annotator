import { useState, createContext } from 'react';

export interface IEditorsContext {
  hasActiveEditor: boolean;
  setActiveEditor: (active: boolean) => void;
}

export const EditorsContext = createContext<IEditorsContext>({} as IEditorsContext)

export function useEditors(): IEditorsContext {
  const [hasActiveEditor, setActiveEditor] = useState(false);

  return {
    hasActiveEditor,
    setActiveEditor
  }
};
