import type { ContactMessage, ProjectLead } from '@/lib/types';

export type InboxKind = 'message' | 'lead';

export type InboxItem =
  | { kind: 'message'; created_at: string; data: ContactMessage }
  | { kind: 'lead'; created_at: string; data: ProjectLead };

/** Merge contact messages and Start Project leads newest-first for the admin inbox. */
export function mergeAdminInbox(
  messages: ContactMessage[],
  leads: ProjectLead[],
): InboxItem[] {
  const items: InboxItem[] = [
    ...messages.map((data) => ({
      kind: 'message' as const,
      created_at: data.created_at,
      data,
    })),
    ...leads.map((data) => ({
      kind: 'lead' as const,
      created_at: data.created_at,
      data,
    })),
  ];
  return items.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function isLeadNew(status: string): boolean {
  return status === 'new' || status === 'unread' || status === '';
}
