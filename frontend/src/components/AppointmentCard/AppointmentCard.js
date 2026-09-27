import { formatBookingDate } from '../../services/mockHealthcareService';
import './AppointmentCard.css';

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 4v3M17.5 4v3M4.5 9.5h15" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <rect x="4" y="5.5" width="16" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 13h.01M12 13h.01M16 13h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

function AppointmentCard({ booking, onView, onRequestCancel, showCancelAction = false }) {
  const isCancelled = booking.status === 'Cancelled';
  const dateLabel = formatBookingDate(booking.date);

  return (
    <div className="appointment-card-wrap">
      <button
        className="appointment-card"
        type="button"
        onClick={onView}
        aria-label={`View ${booking.type} appointment on ${dateLabel} at 10:00 AM`}
      >
        <span className="appointment-card__topline">
          <span className="appointment-card__icon"><CalendarIcon /></span>
          <span className="appointment-card__type">{booking.type}</span>
          <span className={`appointment-card__status appointment-card__status--${isCancelled ? 'cancelled' : 'confirmed'}`}>
            <i />{booking.status}
          </span>
        </span>
        <span className="appointment-card__date"><strong>Tomorrow</strong><span>{dateLabel} · 10:00 AM</span></span>
        <span className="appointment-card__mode">{booking.mode}</span>
        <span className="appointment-card__link">View appointment <ArrowIcon /></span>
      </button>
      {showCancelAction && !isCancelled && (
        <button className="appointment-card__cancel" type="button" onClick={onRequestCancel}>
          Cancel appointment
        </button>
      )}
    </div>
  );
}

export default AppointmentCard;
