import type { MemberRole } from '../types';

/* ============================================================
   CREDENTIALS — Hardcoded team login credentials
   ============================================================ */

export interface UserCredential {
  username: string;
  password: string;
  role: MemberRole;
  name: string;
  initials: string;
  color: 'cyan' | 'green' | 'blue' | 'amber';
}

export const credentials: UserCredential[] = [
  { username: 'naivedya', password: 'lead@cyberforge',    role: 'lead',       name: 'Naivedya', initials: 'NA', color: 'cyan'  },
  { username: 'satwik',   password: 'research@cyberforge', role: 'researcher', name: 'Satwik',   initials: 'SA', color: 'green' },
  { username: 'mohit',    password: 'design@cyberforge',   role: 'designer',   name: 'Mohit',    initials: 'MO', color: 'blue'  },
  { username: 'pragna',   password: 'present@cyberforge',  role: 'presenter',  name: 'Pragna',   initials: 'PR', color: 'amber' },
];

export function authenticate(username: string, password: string): UserCredential | null {
  const user = credentials.find(
    (c) => c.username.toLowerCase() === username.toLowerCase() && c.password === password
  );
  return user ?? null;
}
