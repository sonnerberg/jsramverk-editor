import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { SuccessMessage } from './SuccessMessage.js';

test('renders content', () => {
  const success = 'Success message';
  const component = render(<SuccessMessage success={success} />);

  expect(component.container).toHaveTextContent(success);
  expect(component.container.querySelector('div > div')).toHaveStyle({
    color: 'green',
  });
});
