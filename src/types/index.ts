export type UserRole = 'admin' | 'user' | 'manager';

export type ThemeMode = 'light' | 'dark';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
