import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { Editor } from '../Editor.js';

test('changes document name', () => {
  const dispatch = jest.fn();

  const component = render(<Editor dispatch={dispatch} />);

  const documentNameInput = component.container.querySelector('#documentName');

  const value = 'hello';

  fireEvent.change(documentNameInput, { target: { value } });

  expect(dispatch.mock.calls[0][0].payload).toBe(value);
});
