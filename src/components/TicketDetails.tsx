import type { Ticket, TicketStatus } from '../types';

interface TicketDetailsProps {
  ticket: Ticket | null;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
  saving: boolean;
}

export default function TicketDetails({ ticket, onStatusChange, saving }: TicketDetailsProps) {
  if (!ticket) {
    return (
      <section className="details empty-details" aria-label="Ticket details">
        <div className="empty-icon">↖</div>
        <h2>Select a ticket</h2>
        <p>Choose a ticket from the queue to review its details.</p>
      </section>
    );
  }

  return (
    <section className="details" aria-label="Ticket details">
      <div className="details-eyebrow">{ticket.id} <span>·</span> Created {new Date(ticket.createdAt).toLocaleDateString()}</div>
      <h2>{ticket.subject}</h2>
      <div className="customer-card">
        <div className="avatar" aria-hidden="true">{ticket.customer.split(' ').map((part) => part[0]).join('')}</div>
        <div>
          <strong>{ticket.customer}</strong>
          <p>{ticket.email}</p>
        </div>
      </div>
      <div className="detail-fields">
        <div>
          <span className="field-label">Priority</span>
          <span className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
        </div>
        <label>
          <span className="field-label">Status</span>
          <select
            aria-label="Ticket status"
            value={ticket.status}
            disabled={saving}
            onChange={(event) => onStatusChange(ticket.id, event.target.value as TicketStatus)}
          >
            <option>Open</option>
            <option>In progress</option>
            <option>Resolved</option>
          </select>
        </label>
      </div>
      <div className="description-block">
        <h3>Description</h3>
        <p>{ticket.description}</p>
      </div>
      {saving && <p className="saving-message" role="status">Saving status…</p>}
    </section>
  );
}
