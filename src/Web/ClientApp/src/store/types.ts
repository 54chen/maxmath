export interface User {
  name: string;
  level: number;
}

export interface GameProgress {
  weapon: string;
  questionCount?: number;
  npcReactivateTimes?: Record<string, number>;
}