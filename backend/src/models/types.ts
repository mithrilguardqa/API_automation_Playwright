export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

export interface Car {
  id: string;
  userId: string;
  name: string;
  model: string;
  year: number;
}

export interface Track {
  id: string;
  name: string;
  country: string;
  lengthKm: number;
}

export interface LapRecord {
  id: string;
  userId: string;
  carId: string;
  trackId: string;
  lapTime: number;
  date: string;
}

export type SessionStore = Map<string, string>; // sessionId -> userId
