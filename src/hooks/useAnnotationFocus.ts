import { useEffect } from 'react';
import { useFrame } from 'react-frame-component';
import { useAnnotationPicker } from './useAnnotationPicker';

export function useAnnotationFocus(name: FieldName, type: 'note' | 'highlight', el: HTMLElement) {
  const { window } = useFrame();
  const { selected, select } = useAnnotationPicker();

  // Wire a native onMouseUp listener to the element to monitor for interactions
  useEffect(() => {
    const onFocus = (e: Event) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      select({
        field: name,
        type,
        top: rect.top + (window?.scrollY ?? 0)
      });
    };

    const onBlur = (e: Event) => {
      if (selected?.field === name) {
        select(undefined);
      }
    };

    // Allow each block to receive focus
    el.tabIndex = 0;
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);

    // TODO: Tab management for jumping us to the SelectionActions
    // component (if visible).

    // Note that we can't move SelectionActions around the DOM
    // (no mounting/unmounting) so this is a bit more tricky than
    // just saying it's now a child when this is selected.

    // TODO: Don't have a way of tracking focus LOSS

    return () => {
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, [el, name, type, selected, select, window]);

  return {
    isFocused: selected?.field === name
  };
}
