import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { ErrorMessage } from '../ErrorMessage.js';

test('renders content', () => {
  const error = 'Error message';
  const component = render(<ErrorMessage error={error} />);

  expect(component.container).toHaveTextContent(error);
  expect(component.container.querySelector('div > div')).toHaveStyle({
    color: 'red',
  });
});
