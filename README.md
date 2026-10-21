# Support Queue — React Technical Interview

A small React + TypeScript starter for a 40-minute collaborative coding interview. It uses local mock data; no credentials, external services, or backend setup are required.

## Setup

Requirements: Node.js 22 LTS recommended.

```bash
npm install
npm run dev
```

Optional checks:

```bash
npm run build
npm run test:run
```

## Scenario

You are working on an internal support queue. Support agents need to review tickets, narrow the queue, inspect ticket details, and update ticket status.

The app is intentionally imperfect. You may change the component structure or add files as needed. Talk through your assumptions and trade-offs as you work.

## Interview task (40 minutes)

Please prioritize these items:

1. **Investigate and fix the data defect.** Customer information is not displaying as expected in the ticket queue. Trace the data flow and correct the underlying issue.
2. **Fix the visual defect.** Find and correct the styling problem affecting the ticket list.
3. **Implement search.** The search field is present, but it does not yet filter the list. Search by ticket ID, subject, or customer name.
4. **Implement status filtering.** The dropdown is present, but it does not yet filter the list. The status filter should work together with search. Show a useful empty state when no tickets match.

If time allows, improve one additional area of your choice: status updates, a meaningful test, accessibility, or error handling.

## Mock API reference

The project has an in-memory mock API in `src/api/ticketsApi.ts`. There is **no HTTP server or endpoint URL** to call: import and invoke these async functions directly. Both functions simulate network latency and return promises. The API contract is defined by the `Ticket` and `TicketStatus` types in `src/types.ts`.

### `getTickets()`

**Request:** No parameters. For example:

```ts
import { getTickets } from './api/ticketsApi';
const tickets = await getTickets();
```

**Response:** `Promise<Ticket[]>` — an array of ticket objects. For example, one item in the array looks like:

```json
{
  "id": "SUP-1042",
  "subject": "Unable to reset my password",
  "customer": "Morgan Lee",
  "email": "morgan.lee@example.com",
  "priority": "High",
  "status": "Open",
  "description": "The password reset link expires immediately after I request it. I have tried twice in two browsers.",
  "createdAt": "2026-10-19T14:25:00Z"
}
```

### `updateTicketStatus(ticketId, status)`

**Request:** Two arguments:
- `ticketId`: string, e.g. `"SUP-1042"`.
- `status`: one of `"Open"`, `"In progress"`, or `"Resolved"`.

```ts
import { updateTicketStatus } from './api/ticketsApi';
const updated = await updateTicketStatus('SUP-1042', 'In progress');
```

**Response:** `Promise<Ticket>` — a complete ticket object with the requested `status` applied. If the ID does not exist, the promise rejects with an error. The mock returns the updated ticket but **does not persist the change** to the underlying seed data, so a later `getTickets()` call returns the original statuses.

### Ticket field reference

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Ticket identifier |
| `subject` | `string` | Short issue title |
| `customer` | `string` | Customer display name |
| `email` | `string` | Customer email |
| `priority` | `"Low" \| "Medium" \| "High"` | Priority level |
| `status` | `"Open" \| "In progress" \| "Resolved"` | Current status |
| `description` | `string` | Issue details |
| `createdAt` | `string` | ISO 8601 timestamp |

## Constraints

- Use React with TypeScript.
- No external UI component library is required.
- Prioritize correctness, maintainability, and clear reasoning over visual polish.
- You do not need to build a real backend.

## Discussion topics

Be prepared to explain:
- How you approached debugging the data issue and how you would prevent similar problems.
- State ownership and derived data.
- How you would handle real API calls, concurrent updates, and failures.
- What you would test and how you would evolve the solution for a larger team.

## Testing expectations

Run `npm run test:run`. Two baseline tests (loading and error handling) should pass.
Four tests labeled `exercise:` describe functionality you are asked to complete and
are **expected to fail in the starter project**. Your goal is to make those tests
pass as you work through the exercise. Visual styling should also be checked in
the browser; jsdom does not verify contrast.
