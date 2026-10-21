import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getTickets } from './api/ticketsApi';
import type { Ticket } from './types';

vi.mock('./api/ticketsApi', () => ({
  getTickets: vi.fn(),
  updateTicketStatus: vi.fn(async (ticketId: string, status: Ticket['status']) => ({
    ...mockTickets.find((ticket) => ticket.id === ticketId)!,
    status,
  })),
}));

const mockTickets: Ticket[] = [
  {
    id: 'SUP-1001', subject: 'Cannot sign in', customer: 'Morgan Lee',
    email: 'morgan@example.com', priority: 'High', status: 'Open',
    description: 'Sign in fails.', createdAt: '2026-10-19T12:00:00Z',
  },
  {
    id: 'SUP-1002', subject: 'Billing question', customer: 'Taylor Brooks',
    email: 'taylor@example.com', priority: 'Low', status: 'Resolved',
    description: 'Question about an invoice.', createdAt: '2026-10-18T12:00:00Z',
  },
  {
    id: 'SUP-1003', subject: 'Password reset', customer: 'Jordan Smith',
    email: 'jordan@example.com', priority: 'Medium', status: 'Open',
    description: 'Reset email missing.', createdAt: '2026-10-17T12:00:00Z',
  },
];

beforeEach(() => {
  vi.mocked(getTickets).mockResolvedValue(mockTickets);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

async function renderLoadedApp() {
  render(<App />);
  const list = await screen.findByRole('list', { name: 'Support tickets' });
  await waitFor(() => expect(within(list).getAllByRole('listitem')).toHaveLength(3));
  return { user: userEvent.setup(), list };
}

// In the candidate starter, tests marked "exercise" are EXPECTED TO FAIL.
// They describe the intended behavior after the candidate implements the tasks.
// The load/error tests should pass before any changes.
describe('Support Queue — existing behavior', () => {
  it('loads and displays tickets', async () => {
    const { list } = await renderLoadedApp();
    expect(within(list).getByText('Cannot sign in')).toBeInTheDocument();
    expect(within(list).getByText('Billing question')).toBeInTheDocument();
    expect(within(list).getByText('Password reset')).toBeInTheDocument();
  });

  it('shows an error when tickets cannot be loaded', async () => {
    vi.mocked(getTickets).mockRejectedValueOnce(new Error('network error'));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Tickets could not be loaded');
  });
});

describe('Support Queue — candidate exercises', () => {
  it('exercise: displays customer names in ticket rows', async () => {
    const { list } = await renderLoadedApp();
    expect(within(list).getByText(/Morgan Lee · Open/)).toBeInTheDocument();
    expect(within(list).getByText(/Taylor Brooks · Resolved/)).toBeInTheDocument();
  });

  it('exercise: searches case-insensitively by customer name', async () => {
    const { user, list } = await renderLoadedApp();
    await user.type(screen.getByRole('textbox', { name: 'Search tickets' }), 'tAyLoR');
    expect(within(list).getByText('Billing question')).toBeInTheDocument();
    expect(within(list).queryByText('Cannot sign in')).not.toBeInTheDocument();
    expect(within(list).queryByText('Password reset')).not.toBeInTheDocument();
  });

  it('exercise: filters by ticket status', async () => {
    const { user, list } = await renderLoadedApp();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Resolved');
    expect(within(list).getByText('Billing question')).toBeInTheDocument();
    expect(within(list).queryByText('Cannot sign in')).not.toBeInTheDocument();
    expect(within(list).queryByText('Password reset')).not.toBeInTheDocument();
  });

  it('exercise: combines search and status and shows the empty state', async () => {
    const { user } = await renderLoadedApp();
    await user.type(screen.getByRole('textbox', { name: 'Search tickets' }), 'Taylor');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Open');
    expect(screen.getByText('No tickets found')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Resolved');
    const list = screen.getByRole('list', { name: 'Support tickets' });
    expect(within(list).getByText('Billing question')).toBeInTheDocument();
    expect(within(list).queryByText('Cannot sign in')).not.toBeInTheDocument();
  });
});
