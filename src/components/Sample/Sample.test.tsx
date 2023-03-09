import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

import { Sample } from './Sample';

describe('Tests for Icon component', () => {
  it('renders content', () => {
    const { container } = render(<Sample>Foo bar</Sample>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
