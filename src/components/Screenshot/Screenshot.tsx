import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button, Heading, Text } from '@osuresearch/ui';

export type ScreenshotProps = {
  __noop?: string;
}

export function Screenshot({ }: ScreenshotProps) {
  const ref = useRef<HTMLDivElement>(null);

  const capture = () => {
    const target = document.querySelector('body');

    if (ref.current) {
      html2canvas(ref.current).then((canvas) => {
        ref.current?.appendChild(canvas);
      });
    }
  }

  return (
    <div ref={ref}>
      <Heading level={1}>Aliquam scelerisque mauris non aliquet iaculis.</Heading>
      <Text as="p" fw="bold">
        Vivamus fringilla velit arcu
      </Text>
      <Heading level={2}>Ut pulvinar lacus id ipsum maximus convallis.</Heading>
      <Text as="p">
        Suspendisse tellus dui, ullamcorper vel laoreet et, condimentum ut justo.
        Nunc in tortor non arcu suscipit vestibulum at nec neque.
      </Text>
      <Button onPress={capture}>Capture</Button>
    </div>
  )
}
