export const annotations: Annotation[] = [
  {
    '@context': ['https://www.w3.org/ns/anno.jsonld'],
    'id': 'a1560fa8-965d-4b8a-84af-dcc2eabf4b26',
    'type': 'Annotation',
    'motivation': 'commenting',
    'body': [
      {
        type: 'TextualBody',
        value: '<p>Praesent consectetur <strong>scelerisque blandit</strong>.</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'RippleThread',
        role: 'Reviewer',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ],
    'target': {
      source: 'section-0',
      selector: {
        type: 'RippleAnnoSelector',
        subtype: 'highlight',
        start: 451,
        end: 462,
        top: 1
      }
    },
    'creator': {
      type: 'Person',
      id: 'test',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'created': '2023-02-24T15:40:45Z',
    'modified': '2023-02-24T15:40:45Z'
  },
  {
    '@context': ['https://www.w3.org/ns/anno.jsonld'],
    'id': '7334d7fb-3c7b-4454-8e02-7e5ce4f7e2a1',
    'type': 'Annotation',
    'motivation': 'commenting',
    'body': [
      {
        type: 'TextualBody',
        value:
          'Suspendisse potenti. Nulla in lectus quis sapien dignissim finibus ac vel sapien. Quisque eu lacus massa. Nam odio lorem, porttitor sed fringilla luctus, facilisis quis tortor. Integer eget pretium libero, eu gravida magna.',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'RippleThread',
        role: 'Reviewer',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ],
    'target': {
      source: 'section-0',
      selector: {
        type: 'RippleAnnoSelector',
        subtype: 'highlight',
        start: 397,
        end: 411,
        top: 0
      }
    },
    'creator': {
      type: 'Person',
      id: 'test',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'created': '2023-02-24T15:40:45Z',
    'modified': '2023-02-24T15:40:45Z'
  },
  {
    '@context': ['https://www.w3.org/ns/anno.jsonld'],
    'id': '1f86b7be-fb2d-8405-72h2-6afaca8c8a6',
    'type': 'Annotation',
    'motivation': 'commenting',
    'body': [
      {
        type: 'TextualBody',
        value:
          'Mauris finibus, urna sit amet euismod pellentesque, dolor diam hendrerit diam, eu rhoncus justo nisi non turpis. ',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'RippleThread',
        role: 'Reviewer',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ],
    'target': {
      source: 'section-0',
      selector: {
        type: 'RippleAnnoSelector',
        subtype: 'highlight',
        start: 556,
        end: 614,
        top: 4
      }
    },
    'creator': {
      type: 'Person',
      id: 'test',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'created': '2023-02-24T15:40:45Z',
    'modified': '2023-02-24T15:40:45Z'
  },
  {
    '@context': ['https://www.w3.org/ns/anno.jsonld'],
    'id': '944fd074-4c0b-42f1-bc22-a6dc5983bf2a',
    'type': 'Annotation',
    'motivation': 'commenting',
    'body': [
      {
        type: 'TextualBody',
        value: '<p>This comment is near the end of the document</p>.',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'RippleThread',
        role: 'Analyst',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ],
    'target': {
      source: 'section-95',
      selector: {
        type: 'RippleAnnoSelector',
        subtype: 'highlight',
        start: 235,
        end: 366,
        top: 1000
      }
    },
    'creator': {
      type: 'Person',
      id: 'test',
      name: 'Neil',
      email: 'coplin.7@osu.edu',
      nickname: 'coplin.7'
    },
    'created': '2023-02-24T15:40:45Z',
    'modified': '2023-02-24T15:40:45Z'
  }
];
