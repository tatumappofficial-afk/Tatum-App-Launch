import uuid from 'react-native-uuid';

export function generateId(): string {
  return uuid.v4() as string;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
