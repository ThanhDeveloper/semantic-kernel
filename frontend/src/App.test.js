import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders the healthcare portal hero', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /your health, connected/i })).toBeInTheDocument();
});

test('shows a typing state and the mock response after sending a message', async () => {
  jest.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /open healthcare assistant chat/i }));
  fireEvent.change(screen.getByLabelText(/message healthcare assistant/i), { target: { value: 'I need help' } });
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));

  expect(screen.getByText('I need help')).toBeInTheDocument();
  expect(screen.getByLabelText(/healthcare assistant is typing/i)).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(1250);
    await Promise.resolve();
  });

  expect(screen.getByText('Response from system')).toBeInTheDocument();
  jest.useRealTimers();
});
