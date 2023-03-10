export type AnnotationEventHandler = (annotation: Annotation) => void;

/**
 * Supported annotation events we can listen to
 */
export type AdobeAnnotationEvent =
  | 'ANNOTATION_ADDED'
  | 'ANNOTATION_DELETED'
  | 'ANNOTATION_UPDATED'
  | 'ANNOTATION_CLICKED';

/**
 * Wrapper that provides additional functionality and typing
 * over an AdobeDC Viewer instance.
 */
export class AdobeDCDocument {
  /** AdobeDC Embed Viewer instance */
  private adobeDCView: any;

  /** AdobeDC Embed Annotation Manager instance */
  private annotationManager: any;

  /**
   * Registered annotation event handlers
   */
  private handlers: Map<AdobeAnnotationEvent, AnnotationEventHandler[]>;

  constructor(clientId: string, divId: string) {
    // TODO: Verify AdobeDC is loaded

    // @ts-ignore
    this.adobeDCView = new window.AdobeDC.View({
      clientId,
      divId,
      sendAutoPDFAnalytics: false
    });

    this.handlers = new Map<AdobeAnnotationEvent, AnnotationEventHandler[]>();
  }

  public destroy() {
    // TODO
    console.log('AdobeDCDocument::destroy');
  }

  public preview(url: string, filename: string, id: string) {
    this.adobeDCView
      .previewFile(
        {
          content: {
            location: {
              url
            }
          },
          metaData: {
            id,
            fileName: filename
          }
        },
        {
          // Annotation tools only work in full window embed mode.
          embedMode: 'FULL_WINDOW',
          showAnnotationTools: true,
          showDownloadPDF: false,
          enableAnnotationAPIs: true,
          enableFormFilling: false
        }
      )
      .then((viewer: any) => {
        // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#api-signature-6
        viewer.getAnnotationManager().then((manager: any) => {
          this.connectToManager(manager);
        });
      });
  }

  private connectToManager(manager: any) {
    this.annotationManager = manager;

    manager.setConfig({
      // Hide the built-in commenting system.
      // We're wiring in Ripple's own thread system
      showCommentsPanel: false

      // Does not seem to be a way to disable specific annotation types
      // (e.g. drawing and underline)
      // https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#setconfig-api
    });

    manager.registerEventListener(this.handleAnnotationEvent.bind(this));
  }

  private handleAnnotationEvent(event: any) {
    console.log(event.type, event.data);

    const type = event.type as AdobeAnnotationEvent;
    const annotation = event.data as Annotation;

    const listeners = this.handlers.get(type);
    if (listeners) {
      listeners.forEach((e) => e(annotation));
    }
  }

  public registerHandler(event: AdobeAnnotationEvent, handler: AnnotationEventHandler) {
    const handlers = this.handlers.get(event);
    if (!handlers) {
      this.handlers.set(event, [handler]);
    } else {
      handlers.push(handler);
    }
  }

  public unregisterHandler(event: AdobeAnnotationEvent, handler: AnnotationEventHandler) {
    const handlers = this.handlers.get(event);
    if (!handlers) {
      console.warn('Handler is not registered', event, handler);
      return;
    }

    this.handlers.set(
      event,
      handlers.filter((e) => e !== handler)
    );
  }

  public async deleteAnnotation(id: string): Promise<void> {
    // Reference: https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtos_comments/#deleteannotations-api

    try {
      await this.annotationManager.deleteAnnotations({
        annotationIds: [id]
      });
    } catch (e) {
      console.error('deleteAnnotation error: ', id, e);
      // Safe to ignore errors thrown by Adobe DC here.
    }
  }

  public async addAnnotations(annotations: Annotation[]): Promise<void> {
    // right now it's a thread for compatibility with the hook.
    // Will be migrated to an Annotation later.

    // try {

    // TODO: This needs to filter out non-adobe annotations.
    await this.annotationManager.addAnnotations(annotations);
    //   annotations.map(this.toAdobeAnnotation)
    // );

    // }
    // catch (e) {
    //   // TODO: Deal with it.
    // }
  }

  // private toAdobeAnnotation(thread: Annotation): Annotation {
  //   return {
  //     '@context': [
  //       'http://www.w3.org/ns/anno.jsonld',
  //       'https://comments.acrobat.com/ns/anno.jsonld',
  //     ],
  //     id: thread.id,
  //     type: 'Annotation',
  //     bodyValue: thread.bodyValue, // Not actually useful for Adobe DC
  //     motivation: 'commenting',
  //     created: '2023-02-24T15:40:45Z',
  //     modified: '2023-02-24T15:40:45Z',
  //     creator: {
  //       type: 'Person',
  //       id: thread.creator.id,
  //       name: thread.creator.name,
  //     },
  //     target: thread.target,
  //     role: 'Unknown', // Not from Adobe data.
  //   }
  // }

  public async getAnnotations(): Promise<Annotation[]> {
    const annotations = (await this.annotationManager.getAnnotations()) as Annotation[];
    // TODO: Cache if this is a slow call. Need to benchmark.
    // TODO: Ignore annotations that aren't supported.
    return annotations;
  }

  public async getAnnotationIds(): Promise<string[]> {
    const annotations = await this.getAnnotations();
    return annotations.map((a) => a.id);
  }
}
