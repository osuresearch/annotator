import { createContext, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useListData } from 'react-stately';

export type AnnotationInteractionState = {
  isEditingComment: boolean;
  focused?: Annotation;
}

export type AnnotationsContext = {
  /**
   * Start a new annotation thread and focus it
   *
   * @param source      Field or content we are annotating
   * @param motivation  Why the annotation is being created
   * @param selector    Target of the annotation
   * @param id          Optional IRI of the annotation. If omitted, one will be generated.
   *
   * @returns the new Annotation
   */
  createThread: (
    source: string,
    motivation: AnnotationMotivation,
    selector?: AnnotationSelector,
    id?: AnnotationID
  ) => Annotation;

  /**
   * Start a new reply annotation
   *
   * @param source Annotation this is replying to
   * @param id Optional IRI of the annotation. If omitted, one will be generated.
   *
   * @returns the new Annotation
   */
  createReply: (source: AnnotationID, message: string, id?: AnnotationID) => Annotation;

  /**
   * Focus an annotation, if possible
   */
  focus: (id?: AnnotationID) => void;

  patch: (id: AnnotationID, action: (prev: Annotation) => Annotation) => void;

  /**
   * Update an existing body embed within an annotation
   *
   * @param id
   * @param action
   * @returns
   */
  updateBody: <T extends AnnotationBody>(
    type: T['type'],
    id: AnnotationID,
    action: (prev: T) => T
  ) => void;

  /**
   * Currently focused annotation
   */
  focused?: Annotation;

  /**
   * All annotations
   */
  annotations: Annotation[];

  isEditingComment: boolean
  setIsEditingComment: (value: boolean) => void;
};

export const Context = createContext<AnnotationsContext>({} as AnnotationsContext);

export type UseAnnotationsReturn = AnnotationsContext;

/**
 * Manage a list of annotations that reference a source document.
 *
 * The context returned by this hook is used by a provider
 * to expose a shared state for a set of annotation components.
 *
 * @param initialItems  Existing annotations to preload
 * @param agent         Individual (or system) to log new annotations under
 * @param role          Agent's role in relation to the annotated document.
 */
export function useAnnotations(
  initialItems: Annotation[] = [],
  agent: AnnotationAgent,
  role: string
): UseAnnotationsReturn {
  // React-stately will do the heavy lifting of list management
  const { items, selectedKeys, getItem, append, update, setSelectedKeys } = useListData<Annotation>(
    {
      initialItems,
      getKey: (anno) => anno.id
    }
  );

  const [isEditingComment, setIsEditingComment] = useState(false);

  return useMemo(() => {
    const focusedAnnotationID = (selectedKeys as Set<Key>).values().next().value;

    return <UseAnnotationsReturn>{
      annotations: items,
      focused: focusedAnnotationID ? getItem(focusedAnnotationID) : undefined,
      isEditingComment,
      setIsEditingComment,

      focus(id) {
        setSelectedKeys(new Set(id ? [id] : []));
      },

      createThread(source, motivation, selector, id) {
        const now = new Date().toISOString();

        const anno: Annotation = {
          '@context': 'http://www.w3.org/ns/anno.jsonld',
          'type': 'Annotation',
          'id': id ?? uuidv4(),
          motivation,
          'created': now,
          'modified': now,
          'creator': agent,
          'target': {
            source,
            selector
          },
          'body': [
            {
              type: 'TextualBody',
              value: '',
              format: 'text/html',
              language: 'en'
            },
            {
              type: 'Thread',
              role,
              requiresResponse: false,
              resolved: false,
              deleted: false,
              recoverable: true
            }
          ]
        };

        // TODO: Optional setSelected
        append(anno);
        setSelectedKeys(new Set([anno.id]));
        return anno;
      },

      createReply(source, message, id) {
        const now = new Date().toISOString();

        const anno: Annotation = {
          '@context': 'http://www.w3.org/ns/anno.jsonld',
          'type': 'Annotation',
          'id': id ?? uuidv4(),
          'motivation': 'replying',
          'created': now,
          'modified': now,
          'creator': agent,
          'target': {
            source
          },
          'body': [
            {
              type: 'TextualBody',
              value: message,
              format: 'text/html',
              language: 'en'
            },
            {
              type: 'ThreadReply',
              role,
              deleted: false,
              recoverable: true
            }
          ]
        };

        append(anno);
        return anno;
      },

      patch(id, action) {
        const anno = getItem(id);
        update(id, action(anno));
      },

      updateBody: <T extends AnnotationBody>(
        type: string,
        id: AnnotationID,
        action: (prev: T) => T
      ) => {
        const anno = getItem(id);

        // TODO: Touch modified date.

        update(id, {
          ...anno,
          body: anno.body.map((b) => {
            if (b.type === type) {
              return action(b as T);
            }
            return b;
          })
        });
      }
    };
  }, [items, isEditingComment, selectedKeys, agent, role]);
}
