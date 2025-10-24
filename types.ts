export interface Profile {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  birth_date: string;
  cpf: string;
  avatar: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  motivation: string;
  days_of_week: number[]; // 0=Sun, 6=Sat
  duration_days: 15 | 30 | 45;
  start_date: string; // "YYYY-MM-DD"
  is_active: boolean;
}

export type CheckInStatus = 'completed' | 'partial' | 'missed';

export interface CheckIn {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // "YYYY-MM-DD"
  status: CheckInStatus;
  challenges?: string[];
  motivations?: string[];
  sabotage_patterns?: string[];
  time_of_day?: 'morning' | 'afternoon' | 'evening';
  energy_level?: number; // 1-10
  satisfaction?: number; // 1-10
  mood?: number; // 1-10
  reflection?: string;
}

export interface DailyQuote {
  user_id: string;
  content: string;
  date: string; // "YYYY-MM-DD"
}