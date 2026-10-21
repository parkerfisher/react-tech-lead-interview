export type TicketStatus = 'Open' | 'In progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  email: string;
  priority: TicketPriority;
  status: TicketStatus;
  description: string;
  createdAt: string;
}
