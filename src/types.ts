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

export type MilestoneCost = '0đ' | '20k' | '50k';

export interface Milestone {
  id: number; // 1 to 1000
  domainId: number;
  ticketTypeId: string;
  ticketTypeName: string;
  action: string;
  location: string;
  reward: string;
  immediateBenefit: string; // Được gì NGAY 10 phút tới
  title: string;
  cost: MilestoneCost;
  hasPeople: boolean;
  isDualTicket?: boolean; // Vé Kép: vừa đi chơi vừa học/làm
  dualTicketNote?: string; // Gợi ý học/làm kết hợp
  slotRecommendation?: 'khe1' | 'khe2' | 'khe3'; // Gợi ý 1 trong 3 khe hở
  isBrake?: boolean;
  isMutated?: boolean;
  originalTitle?: string;
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
  cost?: MilestoneCost;
  hasPeople?: boolean;
  isDualTicket?: boolean;
  dualTicketNote?: string;
  slotRecommendation?: 'khe1' | 'khe2' | 'khe3';
  isBrake?: boolean;
  isMutated?: boolean;
  immediateBenefit?: string;
  energyEffect?: '+pin' | '-pin'; // Ổn định năng lượng: +pin (khỏe hơn) / -pin (mệt hơn)
  guiltFree?: boolean; // Ổn định tội lỗi: true = Không tội lỗi / false = Có tội lỗi
}

export interface DeepTimeSettings {
  deepBlock1Start: string; // e.g. "08:30"
  deepBlock1End: string;   // e.g. "11:30"
  deepBlock2Start: string; // e.g. "14:00"
  deepBlock2End: string;   // e.g. "17:00"
  userField?: string;      // e.g. "Công nghệ thông tin", "Marketing", "Kế toán"
}

export interface WeeklySlotAssignment {
  dayOfWeek: number; // 1 to 7 (Thứ 2 đến Chủ Nhật)
  dayName: string;
  milestoneId: number;
  slotType: 'khe1' | 'khe2' | 'khe3';
  suggestedTime: string;
  isCompleted?: boolean;
}

export interface MirrorEntry {
  completedMilestoneCount: number;
  flowMilestoneId: number;
  reflectionNote: string;
  createdAt: string;
  patternInsight: string;
}

export interface SoakTestDayRecord {
  day: number; // 1 to 21
  cost: '0đ' | '20k' | '50k' | '';
  pin: '+pin' | '-pin' | '';
  guilt: 'Không' | 'Có' | '';
  wantRedoTomorrow: 'Có' | 'Không' | '';
  usedBrake: boolean;
  milestoneTitle?: string;
}

export interface LoadTestDayRecord {
  dayId: string; // 't2' to 't7'
  dayName: string;
  loadTier: 'Nhẹ (1 vé)' | 'Trung bình (2 vé)' | 'Nặng (3 vé)';
  targetTickets: number;
  actualTickets: number;
  costTotal: number;
  wantRedoTomorrow: 'Có' | 'Không' | '';
}

export type ExtremeScenarioType = 'normal' | 'exam' | 'no_money' | 'rain';
