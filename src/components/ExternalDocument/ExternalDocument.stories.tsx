import React from 'react';
import { Story, Meta } from '@storybook/react';

import { ExternalDocument, ExternalDocumentProps } from './ExternalDocument';
import { AnnotationsProvider } from '../AnnotationsProvider';
import { annotations } from './mock-annotations';

export default {
  title: 'Components/ExternalDocument',
  component: ExternalDocument,
  argTypes: {}
} as Meta<typeof ExternalDocument>;

export const Simple: Story<ExternalDocumentProps> = (args) => (
  <AnnotationsProvider>
    <ExternalDocument {...args} />
  </AnnotationsProvider>
);
Simple.args = {
  content: `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        * {
          color: purple;
        }
        h1 {
          color: green;
        }

        .box {
          position: relative;
          border: 1px solid black;
          max-width: 50%;
          padding: 16px;
          margin: 4px;
        }
      </style>
    </head>
    <body>
      <header>
        Header content
      </header>
      <main>
        <h1>Heading level 1</h1>

        <p>Before section 1</p>

        <div id="section1" data-section="Section 1">
          <div id="section1-content" data-comment-inline>
            👉  Content for section 1
          </div>
        </div>

        <p>After section 1</p>

        <h2>Heading for section 2</h2>

        <p>Content before section 2 reviewables</p>

        <div id="section2" data-comment-section="Section 2">
          <div id="field1" data-comment-inline>
            👉 <strong>Rich</strong> content for <a href="#section2">section 2</a>. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec nec sapien dolor.
            Suspendisse sed erat vehicula tortor porta tincidunt at eget dui. Quisque nibh
            leo, auctor id odio nec, viverra vestibulum mauris. Vestibulum eu aliquet ipsum.
            Pellentesque interdum dignissim lorem, sit amet dictum velit.
          </div>

          <div id="field2" data-comment-block>
            This is content that can be block-commented on
          </div>

          <div id="field3" data-comment-block>
            This is additional content that can be block-commented on. Donec nec sapien dolor.
            Suspendisse sed erat vehicula tortor porta tincidunt at eget dui.
          </div>

          <div id="field4" data-comment-block>
            This is even more content that can be block-commented on. Quisque nibh
            leo, auctor id odio nec, viverra vestibulum mauris. Vestibulum eu aliquet ipsum.
            Pellentesque interdum dignissim lorem, sit amet dictum velit.
          </div>
        </div>

        <p>Content after section 2 reviewables</p>

        <h3>Heading for subsection 2.1</h3>

        <div id="section2-1" data-comment-section="Subsection 2.1" data-comment-section-level="1">
          <div id="field5" data-comment-inline>
            Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
            nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
            ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.
            Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
            in tortor non arcu suscipit vestibulum at nec neque. Vivamus fringilla velit arcu,
            in hendrerit turpis dignissim vel. Duis imperdiet lobortis tortor non ultrices.
            Cras pretium dui a turpis condimentum, sit amet sollicitudin diam auctor. In porta
            neque sit amet turpis tempus egestas.
          </div>
        </div>

        <h3>Heading for subsection 2.2</h3>

        <div id="section2-2" data-comment-section="Subsection 2.2" data-comment-section-level="1">
          <div id="field6" data-comment-inline>
            <p>Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
            nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
            ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.</p>

            <p>Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
            in tortor non arcu suscipit vestibulum at nec neque.</p>

            <ul>
              <li>Curabitur vel turpis nec odio consequat vulputate ac non enim.</li>
              <li>Ut pulvinar lacus id ipsum maximus convallis.</li>
              <li>Etiam mattis nibh eu sollicitudin hendrerit.</li>
              <li>Cras convallis ipsum at risus suscipit sodales.</li>
              <li>Proin sit amet turpis mattis nunc sagittis dapibus.</li>
            </ul>

            <p>Vivamus fringilla velit arcu,
            in hendrerit turpis dignissim vel. Duis imperdiet lobortis tortor non ultrices.
            Cras pretium dui a turpis condimentum, sit amet sollicitudin diam auctor. In porta
            neque sit amet turpis tempus egestas.</p>
          </div>
        </div>

        <h2>Heading for section 3</h2>

        <div id="section3" data-comment-section="Section 3">
          <div id="field7" data-comment-inline>
            Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
            nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
            ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.
            Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
            in tortor non arcu suscipit vestibulum at nec neque. Vivamus fringilla velit arcu,
            in hendrerit turpis dignissim vel. Duis imperdiet lobortis tortor non ultrices.
            Cras pretium dui a turpis condimentum, sit amet sollicitudin diam auctor. In porta
            neque sit amet turpis tempus egestas.
          </div>

          <p>
            Each li in the below are a separate field with data-comment-block
            and some document-specific styles to wrap contents in a relative
            position box.
          </p>

          <ul>
            <li class="box" id="field8" data-comment-block>Curabitur vel turpis nec odio consequat vulputate ac non enim.</li>
            <li class="box" id="field9" data-comment-block>Ut pulvinar lacus id ipsum maximus convallis.</li>
            <li class="box" id="field10" data-comment-block>Etiam mattis nibh eu sollicitudin hendrerit.</li>
            <li class="box" id="field11" data-comment-block>Cras convallis ipsum at risus suscipit sodales.</li>
            <li class="box" id="field12" data-comment-block>Proin sit amet turpis mattis nunc sagittis dapibus.</li>
          </ul>
        </div>

        <h2>Heading for section 4</h2>

        <div id="section4" data-comment-section="Section 4">
          <div id="field13" data-comment-inline>
            Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
            nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
            ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.
            Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
            in tortor non arcu suscipit vestibulum at nec neque. Vivamus fringilla velit arcu,
            in hendrerit turpis dignissim vel. Duis imperdiet lobortis tortor non ultrices.
            Cras pretium dui a turpis condimentum, sit amet sollicitudin diam auctor. In porta
            neque sit amet turpis tempus egestas.
          </div>
        </div>
      </main>
      <footer>
        Footer content
      </footer>
    </body>
  </html>
  `
};

export const StressTest: Story<ExternalDocumentProps> = (args) => {
  const sections = [...Array(100)].map(
    (_, i) => `
    <div id="section-${i}" data-comment-inline>
      <p>Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
      nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
      ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.</p>

      <p>Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
      in tortor non arcu suscipit vestibulum at nec neque.</p>

      <ul>
        <li>Curabitur vel turpis nec odio consequat vulputate ac non enim.</li>
        <li>Ut pulvinar lacus id ipsum maximus convallis.</li>
        <li>Etiam mattis nibh eu sollicitudin hendrerit.</li>
        <li>Cras convallis ipsum at risus suscipit sodales.</li>
        <li>Proin sit amet turpis mattis nunc sagittis dapibus.</li>
      </ul>

      <p>Vivamus fringilla velit arcu,
      in hendrerit turpis dignissim vel. Duis imperdiet lobortis tortor non ultrices.
      Cras pretium dui a turpis condimentum, sit amet sollicitudin diam auctor. In porta
      neque sit amet turpis tempus egestas.</p>
    </div>
  `
  );

  return (
    <AnnotationsProvider initialItems={annotations}>
      <ExternalDocument
        {...args}
        content={`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * {
                color: purple !important;
              }
              h1 {
                color: green !important;
              }
            </style>
          </head>
          <body>
            <header>
              Header content
            </header>
            <main>
              <h1>Heading level 1</h1>
              ${sections.join('')}
            </main>
            <footer>
              Footer content
            </footer>
          </body>
        </html>
        `}
      />
    </AnnotationsProvider>
  );
};
