import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { Editor } from '../Editor.js';
import { RESET } from '../documentReducer.js';

test('dispatches changes to document name and clears it', () => {
  const dispatch = jest.fn();

  const component = render(<Editor dispatch={dispatch} />);

  const documentNameInput = component.container.querySelector('#documentName');

  const clearDocumentButton = component.container.querySelector(
    'span.ql-formats:nth-child(2) > button:nth-child(1)'
  );

  const value = 'hello';

  fireEvent.change(documentNameInput, { target: { value } });

  expect(dispatch.mock.calls[0][0].payload).toBe(value);

  fireEvent.click(clearDocumentButton);

  expect(dispatch.mock.calls[1][0].type).toBe(RESET);
});
