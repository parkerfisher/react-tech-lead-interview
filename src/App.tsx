import { useEffect, useState } from 'react';
import TicketDetails from './components/TicketDetails';
import TicketList from './components/TicketList';
import { getTickets, updateTicketStatus } from './api/ticketsApi';
import type { Ticket, TicketStatus } from './types';

type StatusFilter = 'All' | TicketStatus;

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getTickets()
      .then((data) => {
        if (!active) return;
        setTickets(data);
        setSelectedId(data[0]?.id ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError('Tickets could not be loaded. Please try again.');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Candidate exercise: connect the search and status controls to the displayed tickets.
  // The input values are already stored in `search` and `statusFilter`.
  const visibleTickets = tickets;

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? null;

  async function handleStatusChange(ticketId: string, status: TicketStatus) {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateTicketStatus(ticketId, status);
      setTickets((current) => current.map((ticket) => ticket.id === ticketId ? { ...ticket, status: updated.status } : ticket));
    } catch {
      setError('Status could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const counts = {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === 'Open').length,
    progress: tickets.filter((ticket) => ticket.status === 'In progress').length,
    resolved: tickets.filter((ticket) => ticket.status === 'Resolved').length,
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">S</div>
        <div className="brand-name">support<span>desk</span></div>
        <div className="topbar-spacer" />
        <div className="agent-avatar" aria-label="Signed in as Alex Morgan">AM</div>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">CUSTOMER OPERATIONS</p>
          <h1>Support queue</h1>
          <p className="subtitle">Review, prioritize, and resolve customer requests.</p>
        </div>
        <div className="queue-total"><strong>{counts.total}</strong><span>total tickets</span></div>
      </section>

      <section className="stats" aria-label="Ticket summary">
        <SummaryCard label="Open" count={counts.open} tone="blue" />
        <SummaryCard label="In progress" count={counts.progress} tone="amber" />
        <SummaryCard label="Resolved" count={counts.resolved} tone="green" />
      </section>

      {error && <div className="error-banner" role="alert">{error}</div>}

      <section className="workspace">
        <div className="queue-panel">
          <div className="queue-heading">
            <div>
              <h2>All tickets</h2>
              <p>{visibleTickets.length} results</p>
            </div>
          </div>
          <div className="filters">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search tickets"
                placeholder="Search by subject, customer, ID…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="filter-select">
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
                <option>All</option>
                <option>Open</option>
                <option>In progress</option>
                <option>Resolved</option>
              </select>
            </label>
          </div>
          {loading ? (
            <div className="panel-message" role="status">Loading tickets…</div>
          ) : visibleTickets.length === 0 ? (
            <div className="panel-message">
              <h3>No tickets found</h3>
              <p>Try another search term or status filter.</p>
            </div>
          ) : (
            <TicketList tickets={visibleTickets} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </div>
        <TicketDetails ticket={selectedTicket} onStatusChange={handleStatusChange} saving={saving} />
      </section>
      <footer>Support Desk <span>·</span> Internal tools prototype</footer>
    </main>
  );
}

function SummaryCard({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <div className="summary-card">
      <span className={`summary-dot ${tone}`} />
      <span className="summary-label">{label}</span>
      <strong>{count}</strong>
    </div>
  );
}
