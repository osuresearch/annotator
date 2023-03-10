import { Code, Group, Heading, Stack } from '@osuresearch/ui';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Frame from 'react-frame-component';

import { Annotations } from '../Annotations';
import { useAnnotationsContext } from '../../hooks/useAnnotationsContext';
import { AdobeDCDocument } from './AdobeDCDocument';

export type PDFDocumentProps = {
  /** Adobe DC services client ID */
  clientId: string;

  /** URL to the PDF to render */
  url: string;

  /** Human-readable filename of the PDF */
  filename: string;
};

/**
 * Container for a reviewable PDF document.
 */
export function PDFDocument({ clientId, url, filename }: PDFDocumentProps) {
  const [doc, setDoc] = useState<AdobeDCDocument>();
  const id = 'adobe-dc-view'; //  useId();
  const ref = useRef<HTMLDivElement>(null);
  const { annotations, focus, clearFocus, create, patch } = useAnnotationsContext();

  useEffect(() => {
    // TODO: This is bad. Make a better solution. This needs to happen only once
    // and ideally from an external script on mount, not injected via React.
    const script = document.createElement('script');
    script.src = 'https://documentservices.adobe.com/view-sdk/viewer.js';
    document.body.appendChild(script);

    let doc: AdobeDCDocument | undefined = undefined;

    document.addEventListener('adobe_dc_view_sdk.ready', () => {
      doc = new AdobeDCDocument(clientId, id);
      setDoc(doc);
    });

    return () => doc?.destroy();
  }, [clientId, id]);

  useEffect(() => {
    if (!doc || !ref.current) {
      return;
    }

    doc.preview(url, filename, '77c6fa5d-6d74-4104-8349-657c8411a834');
  }, [doc, url, filename]);

  // Bind event listeners between the threads hook and the AdobeDC instance
  useEffect(() => {
    if (!doc) return;

    const onAdded = (annotation: Annotation) => {
      create(
        annotation.target.source,
        annotation.motivation,
        annotation.target.selector,

        // Adobe DC generates their own annotation IDs
        annotation.id

        // TODO: Need to pull in the styleSheet as well
      );
    };

    const onRemoved = (annotation: Annotation) => {
      patch(annotation.id, (prev) => ({
        ...prev,
        deleted: true,
        recoverable: true
      }));
    };

    const onUpdated = (annotation: Annotation) => {
      patch(annotation.id, (prev) => ({
        ...prev,
        // Track selector changes on the PDF
        // e.g. dragging notes around, drawing, etc
        target: annotation.target
      }));
    };

    const onClicked = (annotation: Annotation) => {
      focus(annotation.id);
    };

    doc.registerHandler('ANNOTATION_ADDED', onAdded);
    doc.registerHandler('ANNOTATION_DELETED', onRemoved);
    doc.registerHandler('ANNOTATION_UPDATED', onUpdated);
    doc.registerHandler('ANNOTATION_CLICKED', onClicked);

    return () => {
      if (!doc) return;
      doc.unregisterHandler('ANNOTATION_ADDED', onAdded);
      doc.unregisterHandler('ANNOTATION_DELETED', onRemoved);
      doc.unregisterHandler('ANNOTATION_UPDATED', onUpdated);
      doc.unregisterHandler('ANNOTATION_CLICKED', onClicked);
    };
  }, [doc, create, patch, focus]);

  useEffect(() => {
    if (!doc || !annotations) {
      return;
    }

    // TODO: This assumes *all* threads are associated with this
    // document. Eventually, it should only be threads tagged to
    // this particular document ID.

    // Find threads that are tracked but not added yet to the PDF
    // and inject them into the viewer.
    const totalVisible = 0;

    const sync = async () => {
      const ids = await doc.getAnnotationIds();
      const add: Annotation[] = [];

      annotations.forEach((t) => {
        if (!t.deleted && !t.resolved && ids.indexOf(t.id) < 0) {
          add.push(t);
        }
      });

      await doc.addAnnotations(add);
    };

    const ids = doc?.getAnnotationIds();
  }, [doc, annotations]);

  // TODO:
  // - delete annotations in the PDF when our thread is removed or resolved
  // - reapply annotations when our thread is re-established (undo)
  // - focus annotation in the PDF when our thread is focused

  return (
    <Group h="800px" grow>
      <div ref={ref} id={id} style={{ width: 800 }} />
      <Stack
        align="stretch"
        maw={400}
        mah="100%"
        style={{ overflowY: 'scroll', overflowX: 'hidden' }}
      >
        <Annotations />
      </Stack>
    </Group>
  );
}
