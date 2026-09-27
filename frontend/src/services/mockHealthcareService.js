const MOCK_RESPONSE_DELAY = 1250;

const waitForMockResponse = () => new Promise((resolve) => {
  window.setTimeout(resolve, MOCK_RESPONSE_DELAY);
});

const toLocalIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseBookingDate = (date) => new Date(`${date}T12:00:00`);

// Temporary frontend implementation. This can later become POST /api/bookings.
export const createMockBooking = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    id: 'mock-booking-001',
    type: 'Teleconsultation',
    date: toLocalIsoDate(tomorrow),
    time: '10:00',
    mode: 'Online consultation',
    status: 'Confirmed',
  };
};

// This is the boundary the chat uses today; it can later be replaced by an API read.
export const getMockBooking = (booking) => (
  booking?.status === 'Confirmed' ? booking : null
);

// Temporary frontend implementation. This can later become PATCH /api/bookings/:id.
export const cancelMockBooking = (booking) => ({ ...booking, status: 'Cancelled' });

export const formatBookingDate = (date) => new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(parseBookingDate(date));

export const formatCompactBookingDate = (date) => new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
}).format(parseBookingDate(date));

// Mock shape intentionally mirrors a future Semantic Kernel / API response.
export const sendMockHealthcareMessage = async (message, booking) => {
  await waitForMockResponse();
  const command = message.trim().toLowerCase();

  if (command === 'booking') {
    const createdBooking = createMockBooking();
    return {
      message: "Sure! I've prepared a teleconsultation appointment for tomorrow.",
      intent: 'BOOK_APPOINTMENT',
      booking: createdBooking,
    };
  }

  if (command === 'cancel') {
    const activeBooking = getMockBooking(booking);
    if (activeBooking) {
      return {
        message: 'I found your upcoming teleconsultation.',
        intent: 'CANCEL_APPOINTMENT',
        booking: activeBooking,
      };
    }

    return {
      message: "I couldn't find an active upcoming appointment to cancel. Would you like to book a teleconsultation?",
      intent: 'NO_ACTIVE_BOOKING',
      booking: null,
    };
  }

  return {
    message: 'Response from system',
    intent: 'GENERAL_CHAT',
    booking: null,
  };
};

export const confirmMockCancellation = async (booking) => {
  await waitForMockResponse();
  const cancelledBooking = cancelMockBooking(booking);

  return {
    message: 'Your teleconsultation has been cancelled.',
    intent: 'CANCEL_BOOKING_CONFIRMED',
    booking: cancelledBooking,
  };
};
