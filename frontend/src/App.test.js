import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const finishMockResponse = async () => {
  await act(async () => {
    jest.advanceTimersByTime(1250);
    await Promise.resolve();
  });
};

const sendChatMessage = (message) => {
  fireEvent.change(screen.getByLabelText(/message healthcare assistant/i), { target: { value: message } });
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));
};

test('renders the healthcare portal hero', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /your health, connected/i })).toBeInTheDocument();
});

test('keeps normal responses for messages that only contain the booking word', async () => {
  jest.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /open healthcare assistant chat/i }));
  sendChatMessage('booking please');

  expect(screen.getByText('booking please')).toBeInTheDocument();
  expect(screen.getByLabelText(/healthcare assistant is typing/i)).toBeInTheDocument();

  await finishMockResponse();

  expect(screen.getByText('Response from system')).toBeInTheDocument();
  jest.useRealTimers();
});

test('books, views, and cancels a mock teleconsultation', async () => {
  jest.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /open healthcare assistant chat/i }));
  sendChatMessage('BOOKING');
  expect(screen.getByLabelText(/healthcare assistant is typing/i)).toBeInTheDocument();
  await finishMockResponse();

  expect(screen.getByText(/prepared a teleconsultation appointment/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /view teleconsultation appointment/i }));
  expect(screen.getByRole('heading', { name: /appointment details/i })).toBeInTheDocument();
  expect(screen.getByText(/your teleconsultation is confirmed/i)).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole('button', { name: 'Back to Assistant' })[0]);
  sendChatMessage('cancel');
  await finishMockResponse();

  expect(screen.getByText(/found your upcoming teleconsultation/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Cancel appointment' }));
  expect(screen.getByText(/cancel this appointment/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Cancel appointment' }));
  expect(screen.getByLabelText(/healthcare assistant is typing/i)).toBeInTheDocument();
  await finishMockResponse();

  expect(screen.getByText(/your teleconsultation has been cancelled/i)).toBeInTheDocument();
  expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);

  sendChatMessage('cancel');
  await finishMockResponse();
  expect(screen.getByText(/couldn't find an active upcoming appointment to cancel/i)).toBeInTheDocument();
  jest.useRealTimers();
});
