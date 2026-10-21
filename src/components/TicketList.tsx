import type { Ticket } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (ticketId: string) => void;
}

export default function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  return (
    <div className="ticket-list" role="list" aria-label="Support tickets">
      {tickets.map((ticket) => (
        <button
          className={`ticket-row ${selectedId === ticket.id ? 'selected' : ''}`}
          key={ticket.id}
          onClick={() => onSelect(ticket.id)}
          type="button"
          role="listitem"
          aria-pressed={selectedId === ticket.id}
        >
          <span className="ticket-row-top">
            <span className="ticket-id">{ticket.id}</span>
            <span className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
          </span>
          <span className="ticket-subject">{ticket.subject}</span>
          <span className="ticket-meta">{String((ticket as Ticket & { customerName?: string }).customerName)} · {ticket.status}</span>
        </button>
      ))}
    </div>
  );
}
