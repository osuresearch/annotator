import React from 'react';
import { Story, Meta } from '@storybook/react';

import { PDFDocument, PDFDocumentProps } from './PDFDocument';
import { AnnotationsProvider } from '../AnnotationsProvider';

export default {
  title: 'Components/PDFDocument',
  component: PDFDocument,
  argTypes: {}
} as Meta<typeof PDFDocument>;

export const Simple: Story<PDFDocumentProps> = (args) => (
  <AnnotationsProvider>
    <PDFDocument {...args} />
  </AnnotationsProvider>
);
Simple.args = {
  clientId: '274aad324238449bb5170441fb0c2578',
  url: 'https://documentservices.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
  filename: 'Bodea Brochure.pdf'
};
