import { initialTickets } from '../data/tickets';
import type { Ticket, TicketStatus } from '../types';

// Simulates a network boundary. Replace these functions with fetch calls if desired.
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTickets(): Promise<Ticket[]> {
  await wait(350);

  return initialTickets.map((ticket) => ({ ...ticket }));
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus,
): Promise<Ticket> {
  await wait(250);
  const ticket = initialTickets.find((item) => item.id === ticketId);
  if (!ticket) {
    throw new Error(`Ticket ${ticketId} was not found.`);
  }
  return { ...ticket, status };
}
