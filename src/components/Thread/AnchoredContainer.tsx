import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getDocumentPosition } from "../../utils";
import { useAnchorsContext } from "../../hooks/useAnchorsContext";
import { CellListItem, Context as CellListContext } from '../../hooks/useCellList';
import styles from 'styled-components';

export type AnchoredContainerProps = {
  id: string
  el?: HTMLElement
  focused: boolean
  children: React.ReactNode
}

const AlignmentMark = styles.div`
  position: absolute;
  width: 100vw;
  top: 0;
  left: 0;
  margin-left: -30em;
  border-top: 1px solid black;
  background-color: #eee;
`;

const Container = styles.div`
  position: absolute;
  border: 1px solid red;
  top: 0;
  margin-top: -20px;
`;

function Debug({
  id, el, focused
}: {
  id: string
  el?: HTMLElement
  focused: boolean
}) {
  const { items, getItem } = useContext(CellListContext);
  const cellItem = getItem(id);

  if (!el || !cellItem) {
    return <div>No element</div>
  }

  const top = Math.round(getDocumentPosition(el).top);

  return (
    <div>
      {JSON.stringify(cellItem, undefined, 2)}
      <br/>
      El: {el.id} @ {top}

      <AlignmentMark style={{ borderColor: 'red', top: (cellItem.anchorCell - cellItem.cell)  }}>
          {el.id} anchor cell offset
      </AlignmentMark>

      <AlignmentMark style={{ borderColor: 'green' }}>
          {el.id} @ top: {top}
          , anchorCell: {cellItem?.anchorCell}
          , cell: {cellItem?.cell}
      </AlignmentMark>



      {/* <br />
      {fieldAnchor ? fieldAnchor.id : ' no field anchor'}
      <br />
      {scopedAnchor ? scopedAnchor.id : ' no scoped anchor'}
      <br />
      <Text fw="bold">{fieldAnchor?.target?.getBoundingClientRect().top}</Text>
      <Code block>{JSON.stringify(items, undefined, 2)}</Code> */}
    </div>
  );
}




/**
 * Responsible for keeping body content aligned with a target anchor.
 */
export function AnchoredContainer({ id, el, focused, children }: AnchoredContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { items, getItem, addItem, removeItem, updateItem, focus } = useContext(CellListContext);
  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);

  // Add this container into the cell list on mount
  useLayoutEffect(() => {
    if (!el || !ref.current) {
      return;
    }

    const anchorCell = Math.round(getDocumentPosition(el).top);
    const height = ref.current.offsetHeight;

    addItem({ id, anchorCell, cell: anchorCell, height });

    setTop(anchorCell);
    setHeight(height);

    return () => {
      removeItem(id);
    };
  }, [id, el, ref]);

  const item = getItem(id);

  useEffect(() => {
    const item = getItem(id);
    if (!item) {
      return;
    }

    if (item.cell !== top) {
      console.log('update top', el?.id, item.cell);
      setTop(item.cell);
    }

    // If the item height doesn't match our own, update it.
    if (item.height !== height) {
      updateItem(id, { ...item, height });
    }
  }, [items, top, height, id]);

  // Monitor for changes to the top position of our anchor
  useEffect(() => {
    // TODO: This is going to be REAL SLOW since this is
    // constantly monitoring and reading DOM positions
    // recursively up parents. Need a solution that works
    // better. Unfortunately there's no ResizeObserver
    // equivalent that isn't just frequent polling.
    // May want to encapsulate this elsewhere

    let prevTop = 0;

    const handle = setInterval(() => {
      if (!el) {
        console.log('no el');
        return;
      }

      const top = Math.round(getDocumentPosition(el).top);

      if (top === prevTop) {
        console.log('same top');
        return;
      }

      const item = getItem(id);
      if (!item || top === item.anchorCell) {
        return;
      }

      console.log('Update top', el.id, prevTop, top, id);
      prevTop = top;
      updateItem(id, {
        ...item,
        anchorCell: top,
      });
    }, 1000);

    return () => clearInterval(handle);
  }, [id, item]);

  // Observe container height changes and
  // update our cell item to match
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const container = ref.current;

    const observer = new ResizeObserver(() => {
      if (!ref.current || !item) {
        return;
      }

      const newHeight = ref.current.offsetHeight;
      if (newHeight === item.height) {
        return;
      }

      setHeight(newHeight);
    });

    observer.observe(container);

    return () => observer.unobserve(container);
  }, [id, ref, item]);

  // Lock our container to its anchor cell when focused
  useEffect(() => {
    if (focused) {
      const item = getItem(id);
      if (!item || item.cell === item.anchorCell) {
        return;
      }

      // Jump it to the anchor point
      updateItem(id, {
        ...item,
        cell: item.anchorCell,
      });
    }

  }, [items, id, focused]);

  return (
    <Container ref={ref} style={{ top: top }}>
      {children}
      {/* <Debug id={id} el={el} focused={focused} /> */}
    </Container>
  );
}
