import { formatBookingDate } from '../../services/mockHealthcareService';
import './AppointmentDetails.css';

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m13.5 5-7 7 7 7M7 12h11" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" /></svg>;
}

function AppointmentDetails({ booking, onBack }) {
  const isCancelled = booking.status === 'Cancelled';
  const dateLabel = formatBookingDate(booking.date);

  return (
    <main className="appointment-page" aria-labelledby="appointment-details-heading">
      <header className="appointment-page__header">
        <button className="appointment-page__brand" type="button" onClick={onBack} aria-label="Back to CuraHealth assistant">
          <span className="appointment-page__brand-mark">+</span><span>Cura<span>Health</span></span>
        </button>
        <button className="appointment-page__back-link" type="button" onClick={onBack}><BackIcon /> Back to Assistant</button>
      </header>

      <section className="appointment-page__content">
        <p className="appointment-page__eyebrow">Your care, connected</p>
        <h1 id="appointment-details-heading">Appointment Details</h1>
        <p className="appointment-page__intro">
          {isCancelled ? 'This teleconsultation has been cancelled.' : 'Your teleconsultation is confirmed.'}
        </p>

        <article className="details-card">
          <div className="details-card__header">
            <div><p>Upcoming appointment</p><h2>{booking.type}</h2></div>
            <span className={`details-card__status details-card__status--${isCancelled ? 'cancelled' : 'confirmed'}`}><i />{booking.status}</span>
          </div>
          <dl className="details-card__grid">
            <div><dt>Date</dt><dd><strong>Tomorrow</strong>{dateLabel}</dd></div>
            <div><dt>Time</dt><dd>10:00 AM</dd></div>
            <div><dt>Type</dt><dd>{booking.mode}</dd></div>
            <div><dt>Status</dt><dd>{booking.status}</dd></div>
          </dl>
        </article>

        <button className="appointment-page__back-button" type="button" onClick={onBack}><BackIcon /> Back to Assistant</button>
      </section>
    </main>
  );
}

export default AppointmentDetails;
