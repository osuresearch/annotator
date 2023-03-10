type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AnnotationID = string;

/** Supported annotation selector types */
type AnnotationSelector = AdobeAnnoSelector | RippleAnnoSelector;

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
   * or `AnnotationReplyBody` to include Ripple-specific metadata
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
     * In the case of RippleAnnoSelectors, this is the field name.
     */
    source: string;

    /**
     * Selector type to associate the annotation with its context.
     *
     * Supports both Ripple and Adobe formats.
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
   * Ripple currently only supports a limited set of content types.
   */
  format: 'text/html' | 'text/plain';

  /** Language code for the content */
  language: string;
};

/**
 * Annotation body metadata for a Ripple thread.
 */
type AnnotationThreadBody = {
  /** Annotation body class */
  type: 'RippleThread';

  /**
   * Thread creator's role in relation to the current form.
   *
   * They may be submitter, a reviewer, a third party expert, an analyst, etc.
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
 * Annotation body metadata for a reply to a Ripple thread.
 */
type AnnotationReplyBody = {
  /** Annotation body class */
  type: 'RippleReply';

  /**
   * Annotation creator's role in relation to the current form.
   *
   * They may be submitter, a reviewer, a third party expert, an analyst, etc.
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
 */
type TextPositionSelector = {
  // UNUSED: May be extended by RippleAnnoSelector
  type: 'TextPositionSelector';
  start: number;
  end: number;
};

type RippleAnnoSubtype = 'highlight' | 'note';

/**
 * Target selector for Ripple annotations
 */
type RippleAnnoSelector = {
  type: 'RippleAnnoSelector';

  subtype: RippleAnnoSubtype;

  /**
   * Collection instance, if applicable
   */
  instance?: string;

  /**
   * Document-relative top position of the target field.
   * This helps us sort annotations in the UI.
   */
  top: number;

  /**
   * Starting cursor of the text selection
   */
  start?: number;

  /**
   * Ending cursor of the text selection
   */
  end?: number;
};

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
