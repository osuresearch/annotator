import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Group, Heading, Paper, Stack } from '@osuresearch/ui';

import { ReactDocument } from './ReactDocument';
import { AnnotationsProvider } from '../AnnotationsProvider';
import { AnnotationAgent } from '../../types';
import { NoteAnchor } from '../NoteAnchor';

const meta: Meta<typeof ReactDocument> = {
  title: 'Components/ReactDocument',
  component: ReactDocument,
  argTypes: {}
};

export default meta;

type Story = StoryObj<typeof ReactDocument>;

const demoAgent: AnnotationAgent = {
  type: 'Person',
  id: '0123456',
  name: 'Chase',
  email: 'mcmanning.1@osu.edu',
  nickname: 'mcmanning.1'
};

// TODO: Props to scale up how many sections we want to fill out.
export const StressTest: Story = {
  render: () => {
    const annotations = {};
    return (
      <AnnotationsProvider documentId="mock-document" agent={demoAgent} role="Reviewer">
        <p>
         Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
          nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
          ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.
          Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
          in tortor non arcu suscipit vestibulum at nec neque. Vivamus fringilla velit arcu,
          in hendrerit turpis dignissim vel. Duis imperdiet lobortis tortor non ultrices.
          Cras pretium dui a turpis condimentum, sit amet sollicitudin diam auctor. In porta
          neque sit amet turpis tempus egestas.
        </p>

        <ReactDocument>
          <Heading level={1}>Heading level 1</Heading>

          <p>Before section 1</p>

          <NoteAnchor id="section1-content">
            <div id="section1" data-section="Section 1">
              <div id="section1-content" data-comment-inline>
                👉  Content for section 1
              </div>
            </div>
          </NoteAnchor>

          <NoteAnchor id="aftersection1-content">
            <p>After section 1</p>
          </NoteAnchor>

          <Heading level={2}>Heading for section 2</Heading>

          <p>Content before section 2 reviewables</p>

          <div id="section2" data-comment-section="Section 2">
            <NoteAnchor id="field1">
              <div id="field1" data-comment-inline>
                👉 <strong>Rich</strong> content for <a href="#section2">section 2</a>. Lorem ipsum
                dolor sit amet, consectetur adipiscing elit. Donec nec sapien dolor.
                Suspendisse sed erat vehicula tortor porta tincidunt at eget dui. Quisque nibh
                leo, auctor id odio nec, viverra vestibulum mauris. Vestibulum eu aliquet ipsum.
                Pellentesque interdum dignissim lorem, sit amet dictum velit.
              </div>
            </NoteAnchor>

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

          <Heading level={3} id="heading2-1" data-comment-block>Heading for subsection 2.1</Heading>

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

          <Heading level={3}>Heading for subsection 2.2</Heading>

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

          <Heading level={2}>Heading for section 3</Heading>

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
              <li className="box" id="field8" data-comment-block>Curabitur vel turpis nec odio consequat vulputate ac non enim.</li>
              <li className="box" id="field9" data-comment-block>Ut pulvinar lacus id ipsum maximus convallis.</li>
              <li className="box" id="field10" data-comment-block>Etiam mattis nibh eu sollicitudin hendrerit.</li>
              <li className="box" id="field11" data-comment-block>Cras convallis ipsum at risus suscipit sodales.</li>
              <li className="box" id="field12" data-comment-block>Proin sit amet turpis mattis nunc sagittis dapibus.</li>
            </ul>
          </div>

          <Heading level={2}>Heading for section 4</Heading>

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

          {[...Array(100)].map(
            (_, i) =>
            <div key={i}>
              <strong>Long field {i}</strong>
              <div id={`field${i}`} data-comment-inline>
                <p>Aliquam scelerisque mauris non aliquet iaculis. Nullam egestas urna risus,
                nec sodales nisl facilisis sed. Duis vitae velit sed ipsum consectetur blandit
                ut at diam. Vivamus pretium erat non enim hendrerit, id auctor metus lobortis.</p>

                <NoteAnchor id={`stress-field${i}`}>
                  <p>Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo. Nunc
                  in tortor non arcu suscipit vestibulum at nec neque.</p>
                </NoteAnchor>

                <ul className="rui-list">
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
          )}
        </ReactDocument>
      </AnnotationsProvider>
    );
  }
};
