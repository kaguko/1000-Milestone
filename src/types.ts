export interface Domain {
  id: number;
  name: string;
  shortName: string;
  iconName: string;
  color: string;
  accentBg: string;
  tagline: string;
  description: string;
}

export interface TicketType {
  id: string; // e.g. "1.1", "1.5"
  domainId: number;
  name: string;
  description: string;
}

export interface Milestone {
  id: number; // 1 to 1000
  domainId: number;
  ticketTypeId: string;
  ticketTypeName: string;
  action: string;
  location: string;
  reward: string;
  title: string;
  isCompleted?: boolean;
  completedAt?: string;
  feeling?: string;
  wantRedo?: boolean | null;
}

export interface SheetRecord {
  id: number;
  ticketText: string;
  feeling: string;
  wantRedo: boolean | null;
  completedAt: string;
}
