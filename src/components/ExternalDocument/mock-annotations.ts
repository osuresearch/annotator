export const shortFormAnnotations: Annotation[] = [
  // note these are out of order on purpose so that
  // we can test sorting annotation threads based on
  // document anchor positions
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '617cf321-fac1-4a1d-a235-224bf28faff0',
    'motivation': 'commenting',
    'created': '2023-03-10T16:45:37.514Z',
    'modified': '2023-03-10T16:45:37.514Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field13',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'highlight',
        top: 0,
        start: 48,
        end: 74
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>And an inline for Nullam egestas urna risus of section 4</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '94a71eb5-a90e-4695-b2a8-556428d5416c',
    'motivation': 'replying',
    'created': '2023-03-10T16:49:04.065Z',
    'modified': '2023-03-10T16:49:04.065Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: '9d26aaef-5c1c-4c46-88f0-60f69de6ed9e'
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>And a reply about that 2.2 </p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'ThreadReply',
        role: 'Test',
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '47509192-8945-4522-b251-2aba3a7f22df',
    'motivation': 'replying',
    'created': '2023-03-10T16:49:08.321Z',
    'modified': '2023-03-10T16:49:08.321Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: '9d26aaef-5c1c-4c46-88f0-60f69de6ed9e'
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>With another reply about it.</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'ThreadReply',
        role: 'Test',
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': 'ca3c2575-44c1-4af5-8fd4-5cd46ffa5dcd',
    'motivation': 'commenting',
    'created': '2023-03-10T16:44:38.927Z',
    'modified': '2023-03-10T16:44:38.927Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field1',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'highlight',
        top: 0,
        start: 32,
        end: 58
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>inline comment for Lorem ipsum dolor sit amet</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': 'b92f78c4-94ef-4c16-8cfa-444a3a40ecb5',
    'motivation': 'commenting',
    'created': '2023-03-10T16:44:49.542Z',
    'modified': '2023-03-10T16:44:49.542Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field1',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'highlight',
        top: 0,
        start: 244,
        end: 271
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>And an inline for Vestibulum eu aliquet ipsum in section 2</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '9d26aaef-5c1c-4c46-88f0-60f69de6ed9e',
    'motivation': 'commenting',
    'created': '2023-03-10T16:45:06.273Z',
    'modified': '2023-03-10T16:45:06.273Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field6',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'note',
        top: 0
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>Block level comment for subsection 2.2</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '06e98c5b-00f7-42a9-8651-fa46832d6439',
    'motivation': 'commenting',
    'created': '2023-03-10T16:45:19.907Z',
    'modified': '2023-03-10T16:45:19.907Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field8',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'note',
        top: 0
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>Block comment for Curabitur vel turpis</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '2a068ceb-f83f-4fc8-92bb-7f895616d4e1',
    'motivation': 'commenting',
    'created': '2023-03-10T16:45:30.301Z',
    'modified': '2023-03-10T16:45:30.301Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field12',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'note',
        top: 0
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>Block comment for Proin sit amet turpis</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '7aab03d9-4005-4ca2-8830-4cdcccec54fa',
    'motivation': 'commenting',
    'created': '2023-03-10T16:48:09.045Z',
    'modified': '2023-03-10T16:48:09.045Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'field5',
      selector: {
        type: 'RUIAnnoSelector',
        subtype: 'highlight',
        top: 0,
        start: 49,
        end: 166
      }
    },
    'body': [
      {
        type: 'TextualBody',
        value:
          '<p>Subsection 2.1 Nullam egestas urna risus, nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit ut at diam.</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'Thread',
        role: 'Test',
        requiresResponse: false,
        resolved: false,
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': '31b7810d-f21f-4a23-a13a-cce093f25df8',
    'motivation': 'replying',
    'created': '2023-03-10T16:48:25.842Z',
    'modified': '2023-03-10T16:48:25.842Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: '7aab03d9-4005-4ca2-8830-4cdcccec54fa'
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>And some reply about that</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'ThreadReply',
        role: 'Test',
        deleted: false,
        recoverable: true
      }
    ]
  },
  {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'type': 'Annotation',
    'id': 'd467008c-0370-4000-a80e-f6e4eedd6ed9',
    'motivation': 'replying',
    'created': '2023-03-10T16:48:36.929Z',
    'modified': '2023-03-10T16:48:36.929Z',
    'creator': {
      type: 'Person',
      id: '0123456',
      name: 'Chase',
      email: 'mcmanning.1@osu.edu',
      nickname: 'mcmanning.1'
    },
    'target': {
      source: 'ca3c2575-44c1-4af5-8fd4-5cd46ffa5dcd'
    },
    'body': [
      {
        type: 'TextualBody',
        value: '<p>And a reply about lorem ipsum</p>',
        format: 'text/html',
        language: 'en'
      },
      {
        type: 'ThreadReply',
        role: 'Test',
        deleted: false,
        recoverable: true
      }
    ]
  }
];

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
        type: 'Thread',
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
        type: 'RUIAnnoSelector',
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
        type: 'Thread',
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
        type: 'RUIAnnoSelector',
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
        type: 'Thread',
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
        type: 'RUIAnnoSelector',
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
        type: 'Thread',
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
        type: 'RUIAnnoSelector',
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
