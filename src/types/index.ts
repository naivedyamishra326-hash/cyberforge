/* ============================================================
   CYBERFORGE — TYPE DEFINITIONS
   ============================================================ */

// ---------- TEAM ----------
export type MemberRole = 'lead' | 'researcher' | 'designer' | 'presenter';

export interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  title: string;
  primaryTrack: string;
  secondaryTrack: string;
  currentFocus: string;
  currentTask: string;
  progress: number; // 0–100
  color: 'cyan' | 'green' | 'blue' | 'amber';
  initials: string;
}

// ---------- SKILLS ----------
export type SkillStatus = 'not-started' | 'learning' | 'practicing' | 'comfortable' | 'can-teach';

export interface SkillEntry {
  skill: string;
  lead: SkillStatus;
  researcher: SkillStatus;
  designer: SkillStatus;
  presenter: SkillStatus;
}

export interface SkillCategory {
  name: string;
  skills: SkillEntry[];
}

// ---------- ROADMAP ----------
export interface RoadmapDay {
  day: number;
  title: string;
  subtitle: string;
  objectives: string[];
  teamAssignments: Record<MemberRole, string>;
  exercise: string;
  deliverable: string;
  estimatedHours: number;
  prerequisites: string[];
}

// ---------- TASKS ----------
export type TaskStatus = 'today' | 'upcoming' | 'blocked' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  owner: MemberRole;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedMinutes: number;
  day: number;
}

// ---------- RESOURCES ----------
export type ResourceCategory = 'cybersecurity' | 'ai-ml' | 'development' | 'design' | 'presentation';
export type ResourcePriority = 'core' | 'optional';

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  priority: ResourcePriority;
  description: string;
  estimatedMinutes: number;
  relevantMembers: MemberRole[];
  url?: string;
  day?: number;
}

// ---------- BLOCKERS ----------
export interface Blocker {
  id: string;
  member: MemberRole;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// ---------- SKILL GAP ----------
export interface SkillGap {
  skill: string;
  member: MemberRole;
  currentStatus: SkillStatus;
}

// ---------- NAVIGATION ----------
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}
