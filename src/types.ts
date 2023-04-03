type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AnchorType = 'highlight' | 'note' | 'tmp';

type AnchorRef = {
  /**
   * Explicit Element ID to target with this anchor.
   *
   * Position of this element drives positioning of anchored elements.
   */
  id?: string;

  /**
   * Field name we're referencing.
   *
   * This will be used for a `FragmentSelector.value` when
   * creating new annotations on a field.
   */
  source: string;
  type?: AnchorType;
};

type NewAnchor = Omit<Anchor, 'id'> & {
  id?: string;
};

type Anchor = {
  id: string;
  type?: AnchorType;
  source: string;

  /**
   * Target rect in the document to anchor *to*
   */
  target: Rect
};

type AnnotationID = string;

/** Supported annotation selector types */
type AnnotationSelector = AdobeAnnoSelector | FragmentSelector | TextPositionSelector;

/** Supported annotation body types */
type AnnotationBody = AnnotationTextualBody | AnnotationReplyBody | AnnotationThreadBody;

/** Supported annotation motivations */
type AnnotationMotivation = 'commenting' | 'questioning' | 'replying';

/**
 * W3C annotation data structure.
 *
 * To replace our Thread/ThreadReply data eventually.
 *
 * See: https://www.w3.org/TR/annotation-model/
 */
type Annotation = {
  /**
   * The Annotation MUST have 1 or more @context values and
   * http://www.w3.org/ns/anno.jsonld MUST be one of them.
   *
   * If there is only one value, then it MUST be provided as a string.
   */
  '@context': string | string[];

  'type': 'Annotation';

  /**
   * IRI (Internationalized Resource Identifier) for this annotation.
   *
   * https://www.w3.org/TR/annotation-model/#dfn-iri
   */
  'id': AnnotationID;

  /**
   * The reason why the Annotation was created.
   *
   * Details for each type of motivation are available at
   * https://www.w3.org/TR/annotation-model/#motivation-and-purpose
   */
  'motivation': AnnotationMotivation;

  /**
   * The time at which the resource was created.
   *
   * The datetime MUST be a `xsd:dateTime` with the UTC timezone expressed as "Z".
   */
  'created': string;

  /**
   * The time at which the resource was modified, after creation.
   *
   * The datetime MUST be a `xsd:dateTime` with the UTC timezone expressed as "Z".
   */
  'modified'?: string;

  /**
   * The agent responsible for creating the resource.
   * This may be either a human, an organization or a software agent.
   */
  'creator': AnnotationAgent;

  /**
   * Embedded resources within the annotation.
   *
   * Typically this includes an `AnnotationTextualBody` with a text/html
   * comment value and *either* (mutually exclusive) an `AnnotationThreadBody`
   * or `AnnotationReplyBody` to include specific metadata
   * about an annotation available as a thread or reply within a thread.
   */
  'body': AnnotationBody[];

  /**
   * The relationship between an Annotation and its Target.
   */
  'target': {
    /**
     * The IRI that identifies the target resource.
     *
     * This is often a unique identifier for the document that
     * we are currently annotating.
     */
    id: string;

    /**
     * Selector type to associate the annotation with its context.
     *
     * Supports both our own and Adobe formats.
     *
     * Selector will be omitted if the annotation is a reply.
     */
    selector?: AnnotationSelector;
  };

  /**
   * The relationship between an Annotation and the Style.
   */
  'stylesheet'?: {
    type: 'CssStylesheet';
    name: string;
  };
};

/**
 * W3C textual body model of an annotation
 */
type AnnotationTextualBody = {
  /** Annotation body class */
  type: 'TextualBody';

  /** The character sequence of the content */
  value: string;

  /**
   * Content format MIME type.
   *
   * Our annotations currently only supports a limited set of content types.
   */
  format: 'text/html' | 'text/plain';

  /** Language code for the content */
  language: string;
};

/**
 * Annotation body metadata for a thread.
 */
type AnnotationThreadBody = {
  /** Annotation body class */
  type: 'Thread';

  /**
   * Thread creator's role in relation to the current document.
   *
   * They may be submitter, a reviewer, a third party expert, an analyst, etc.
   *
   * The same Annotation Agent (creator) may have different roles
   * within the context of an annotated document.
   */
  role: string;

  /**
   * Has this thread been marked as one requiring response and resolution
   */
  requiresResponse: boolean;

  /**
   * If this thread requires response / resolution, has it been resolved?
   */
  resolved: boolean;

  /** Is this thread deleted but recoverable */
  deleted: boolean;

  /**
   * Can this thread be recovered once deleted
   *
   * Threads with no content tend to not be recoverable.
   */
  recoverable: boolean;
};

/**
 * Annotation body metadata for a reply to a thread.
 */
type AnnotationReplyBody = {
  /** Annotation body class */
  type: 'ThreadReply';

  /**
   * Annotation creator's role in relation to the current document.
   *
   * They may be submitter, a reviewer, a third party expert, an analyst, etc.
   *
   * The same Annotation Agent (creator) may have different roles
   * within the context of an annotated document.
   */
  role: string;

  /** Is this reply deleted but recoverable */
  deleted: boolean;

  /**
   * Can this reply be recovered once deleted
   *
   * Replies with no content tend to not be recoverable.
   */
  recoverable: boolean;
};

/**
 * Agent responsible for creating an annotation.
 *
 * This may be either a human, an organization or a software agent.
 */
type AnnotationAgent = {
  /**
   * Type of agent.
   *
   * Details for each type of agent are available at
   * https://www.w3.org/TR/annotation-model/#agents
   */
  type: 'Person' | 'Organization' | 'Software';

  /** The IRI that identifies the agent. */
  id: string;

  /** The name of the agent. */
  name: string;

  /** The email address associated with the agent, using the mailto: IRI scheme. */
  email?: string;

  /**
   * Alternative name for the agent.
   *
   * In the case of people, this should be their username for avatar resolution.
   */
  nickname?: string;
};

/**
 * W3C target selector for a text range
 *
 * https://www.w3.org/TR/annotation-model/#text-position-selector
 *
 * For more information, see:
 */
type TextPositionSelector = {
  type: 'TextPositionSelector';

  /**
   * The starting position of the segment of text. The first character in the
   * full text is character position 0, and the character is included within
   * the segment.
   */
  start: number;

  /**
   * The end position of the segment of text. The character is not included
   * within the segment.
   */
  end: number;
};

type RUIAnnoSubtype = 'highlight' | 'note';

/**
 * W3C target selector for a document fragment
 *
 * Examples of HTML, PDF, and Media resources selectors:
 * ```
 * {  type: 'FragmentSelector',
 *    conformsTo: 'http://tools.ietf.org/rfc/rfc3236',
 *    value: 'namedSection'
 * },
 * {  type: 'FragmentSelector',
 *    conformsTo: 'http://tools.ietf.org/rfc/rfc3778',
 *    value: 'page=10&viewrect=50,50,640,480'
 * },
 * {  type: 'FragmentSelector',
 *    conformsTo: 'http://www.w3.org/TR/media-frags/',
 *    value: 'xywh=50,50,640,480'
 * }
* ```
 *
 * For more information, see:
 * https://www.w3.org/TR/annotation-model/#text-position-selector
 */
type FragmentSelector = {
  type: 'FragmentSelector';

  /**
   * The contents of the fragment component of an IRI that
   * describes the Segment.
   */
  value: string;

  /**
   * The relationship between the FragmentSelector and the specification
   * that defines the syntax of the IRI fragment in the value property.
   */
  conformsTo?: string;

  /**
   * The relationship between a broader selector and a more specific selector.
   *
   * For annotating forms, the fragment selector often points to the
   * field we're annotating and the refinement is an optional `TextPositionSelector`
   * to indicate the text range to highlight within that field.
   */
  refinedBy?: AnnotationSelector;
}

/**
 * Target selector for Adobe DC View annotations.
 *
 * Note that `shape`, `underline`, and `strikeout` subtypes are not supported.
 *
 * For more information on Adobe's schema, see:
 * https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#annotation-schema
 */
type AdobeAnnoSelector = {
  type: 'AdobeAnnoSelector';

  /**
   * - Highlights are regions of text that are selected and commented on.
   * - Notes are floating "sticky notes" that may be placed anywhere in the document.
   * - Freetext are free-form inputs that are written directly onto the document.
   */
  subtype: 'highlight' | 'note' | 'freetext';

  /**
   * Hex color for the annotation
   */
  strokeColor?: string;

  /**
   * 4 entry array of the bounding box
   */
  boundingBox?: number[];

  /**
   * An array of points that mean something and I have no idea what.
   * But they're a length 16 when highlighting text.
   */
  quadPoints?: number[];

  node: {
    /**
     * Page index
     */
    index: number;
  };

  /** Float from 0.0 to 1.0 */
  opacity?: number;

  /**
   * The name of the class used in the CSS description that
   * SHOULD be applied to the Specific Resource.
   */
  styleClass?: string;
};
