import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  TeamMember, SkillCategory, SkillStatus, Task, TaskStatus,
  Resource, MemberRole, Blocker, SkillGap,
} from '../types';
import {
  team as defaultTeam,
  roadmap as defaultRoadmap,
  skillCategories as defaultSkills,
  tasks as defaultTasks,
  resources as defaultResources,
} from '../data/store';
import type { RoadmapDay } from '../types';

/* ============================================================
   STATE SHAPE
   ============================================================ */

export type LearningNodeStatus = 'not-started' | 'in-progress' | 'completed';

export interface LearningNode {
  id: string;
  label: string;
  status: LearningNodeStatus;
}

export interface MemberLearningPath {
  role: MemberRole;
  nodes: LearningNode[];
}

export interface ProblemStatement {
  text: string;
  stages: ProblemStage[];
  savedAt: string | null;
}

export interface ProblemStage {
  name: string;
  assignee: MemberRole | 'unassigned';
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
}

export interface ActivityLogEntry {
  id: string;
  message: string;
  timestamp: string;
  actor: string;
}

export interface AppState {
  team: TeamMember[];
  skillCategories: SkillCategory[];
  tasks: Task[];
  resources: Resource[];
  roadmap: RoadmapDay[];
  learningPaths: MemberLearningPath[];
  problem: ProblemStatement;
  completedResources: Record<string, MemberRole[]>; // resourceId -> roles who completed
  activityLog: ActivityLogEntry[];
}

/* ============================================================
   INITIAL STATE — everything starts at zero
   ============================================================ */

const defaultPaths: Record<MemberRole, string[]> = {
  lead:       ['Cybersecurity', 'Networking', 'Web Security', 'Threat Intelligence', 'Reverse Engineering', 'Python/API', 'ML', 'AI Security', 'Integration'],
  researcher: ['Cybersecurity', 'Threat Intelligence', 'Security Analysis', 'OWASP', 'Detection', 'AI Security'],
  designer:   ['Figma', 'Design System', 'UX', 'Security UX', 'Prototype', 'Handoff'],
  presenter:  ['Git', 'Frontend', 'API Basics', 'Figma', 'Security UX', 'Demo', 'Pitch'],
};

const defaultStages = [
  'PROBLEM', 'RESEARCH', 'THREAT MODEL', 'REQUIREMENTS',
  'ARCHITECTURE', 'DESIGN', 'IMPLEMENTATION', 'TESTING', 'DEMO',
];

function buildInitialState(): AppState {
  // Reset all team progress to 0
  const teamReset = defaultTeam.map(m => ({ ...m, progress: 0 }));

  // Reset all skills to not-started
  const skillsReset: SkillCategory[] = defaultSkills.map(cat => ({
    ...cat,
    skills: cat.skills.map(s => ({
      ...s,
      lead: 'not-started' as SkillStatus,
      researcher: 'not-started' as SkillStatus,
      designer: 'not-started' as SkillStatus,
      presenter: 'not-started' as SkillStatus,
    })),
  }));

  // Reset all tasks to upcoming
  const tasksReset = defaultTasks.map(t => ({ ...t, status: 'upcoming' as TaskStatus }));

  // Build learning paths with not-started nodes
  const learningPaths: MemberLearningPath[] = (Object.keys(defaultPaths) as MemberRole[]).map(role => ({
    role,
    nodes: defaultPaths[role].map((label, i) => ({
      id: `${role}-${i}`,
      label,
      status: 'not-started' as LearningNodeStatus,
    })),
  }));

  return {
    team: teamReset,
    skillCategories: skillsReset,
    tasks: tasksReset,
    resources: [...defaultResources],
    roadmap: [...defaultRoadmap],
    learningPaths,
    problem: {
      text: '',
      stages: defaultStages.map(name => ({
        name,
        assignee: 'unassigned',
        status: 'pending',
        notes: '',
      })),
      savedAt: null,
    },
    completedResources: {},
    activityLog: [],
  };
}

/* ============================================================
   ACTIONS
   ============================================================ */

type Action =
  | { type: 'UPDATE_SKILL'; category: string; skill: string; role: MemberRole; status: SkillStatus; actor: string }
  | { type: 'UPDATE_LEARNING_NODE'; role: MemberRole; nodeId: string; status: LearningNodeStatus; actor: string }
  | { type: 'ADD_LEARNING_NODE'; role: MemberRole; label: string; actor: string }
  | { type: 'REMOVE_LEARNING_NODE'; role: MemberRole; nodeId: string; actor: string }
  | { type: 'UPDATE_TASK_STATUS'; taskId: string; status: TaskStatus; actor: string }
  | { type: 'ADD_TASK'; task: Omit<Task, 'id'>; actor: string }
  | { type: 'ADD_RESOURCE'; resource: Omit<Resource, 'id'>; actor: string }
  | { type: 'DELETE_RESOURCE'; resourceId: string; actor: string }
  | { type: 'COMPLETE_RESOURCE'; resourceId: string; role: MemberRole; actor: string }
  | { type: 'UPDATE_PROBLEM_TEXT'; text: string }
  | { type: 'UPDATE_PROBLEM_STAGE'; stageIndex: number; updates: Partial<ProblemStage> }
  | { type: 'SAVE_PROBLEM' }
  | { type: 'RENAME_SKILL'; category: string; oldName: string; newName: string; actor: string }
  | { type: 'RESET_ALL' }
  ;

function addLog(state: AppState, message: string, actor: string): ActivityLogEntry[] {
  const entry: ActivityLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    message,
    timestamp: new Date().toISOString(),
    actor,
  };
  return [entry, ...state.activityLog].slice(0, 50); // keep last 50
}

function recomputeProgress(state: AppState): TeamMember[] {
  return state.team.map(member => {
    const path = state.learningPaths.find(p => p.role === member.role);
    if (!path || path.nodes.length === 0) return { ...member, progress: 0 };
    const completed = path.nodes.filter(n => n.status === 'completed').length;
    const progress = Math.round((completed / path.nodes.length) * 100);
    return { ...member, progress };
  });
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SKILL': {
      const skillCategories = state.skillCategories.map(cat => {
        if (cat.name !== action.category) return cat;
        return {
          ...cat,
          skills: cat.skills.map(s => {
            if (s.skill !== action.skill) return s;
            return { ...s, [action.role]: action.status };
          }),
        };
      });
      return {
        ...state,
        skillCategories,
        activityLog: addLog(state, `${action.actor} marked "${action.skill}" as ${action.status}`, action.actor),
      };
    }

    case 'RENAME_SKILL': {
      const skillCategories = state.skillCategories.map(cat => {
        if (cat.name !== action.category) return cat;
        return {
          ...cat,
          skills: cat.skills.map(s => {
            if (s.skill !== action.oldName) return s;
            return { ...s, skill: action.newName };
          }),
        };
      });
      return {
        ...state,
        skillCategories,
        activityLog: addLog(state, `${action.actor} renamed skill "${action.oldName}" to "${action.newName}"`, action.actor),
      };
    }

    case 'UPDATE_LEARNING_NODE': {
      const learningPaths = state.learningPaths.map(path => {
        if (path.role !== action.role) return path;
        return {
          ...path,
          nodes: path.nodes.map(n =>
            n.id === action.nodeId ? { ...n, status: action.status } : n
          ),
        };
      });
      const newState = { ...state, learningPaths, activityLog: addLog(state, `${action.actor} updated learning node to ${action.status}`, action.actor) };
      return { ...newState, team: recomputeProgress(newState) };
    }

    case 'ADD_LEARNING_NODE': {
      const learningPaths = state.learningPaths.map(path => {
        if (path.role !== action.role) return path;
        return {
          ...path,
          nodes: [...path.nodes, {
            id: `${action.role}-${Date.now()}`,
            label: action.label,
            status: 'not-started' as LearningNodeStatus,
          }],
        };
      });
      return { ...state, learningPaths, activityLog: addLog(state, `${action.actor} added "${action.label}" to ${action.role}'s path`, action.actor) };
    }

    case 'REMOVE_LEARNING_NODE': {
      const learningPaths = state.learningPaths.map(path => {
        if (path.role !== action.role) return path;
        return { ...path, nodes: path.nodes.filter(n => n.id !== action.nodeId) };
      });
      const newState = { ...state, learningPaths, activityLog: addLog(state, `${action.actor} removed a node from ${action.role}'s path`, action.actor) };
      return { ...newState, team: recomputeProgress(newState) };
    }

    case 'UPDATE_TASK_STATUS': {
      const tasks = state.tasks.map(t =>
        t.id === action.taskId ? { ...t, status: action.status } : t
      );
      return { ...state, tasks, activityLog: addLog(state, `${action.actor} moved task to ${action.status}`, action.actor) };
    }

    case 'ADD_TASK': {
      const id = `t-${Date.now()}`;
      return {
        ...state,
        tasks: [...state.tasks, { ...action.task, id }],
        activityLog: addLog(state, `${action.actor} created task "${action.task.title}"`, action.actor),
      };
    }

    case 'ADD_RESOURCE': {
      const id = `r-${Date.now()}`;
      return {
        ...state,
        resources: [...state.resources, { ...action.resource, id }],
        activityLog: addLog(state, `${action.actor} added resource "${action.resource.title}"`, action.actor),
      };
    }

    case 'DELETE_RESOURCE': {
      return {
        ...state,
        resources: state.resources.filter(r => r.id !== action.resourceId),
        activityLog: addLog(state, `${action.actor} deleted a resource`, action.actor),
      };
    }

    case 'COMPLETE_RESOURCE': {
      const prev = state.completedResources[action.resourceId] || [];
      if (prev.includes(action.role)) return state;
      return {
        ...state,
        completedResources: {
          ...state.completedResources,
          [action.resourceId]: [...prev, action.role],
        },
        activityLog: addLog(state, `${action.actor} completed a resource`, action.actor),
      };
    }

    case 'UPDATE_PROBLEM_TEXT':
      return { ...state, problem: { ...state.problem, text: action.text } };

    case 'UPDATE_PROBLEM_STAGE': {
      const stages = state.problem.stages.map((s, i) =>
        i === action.stageIndex ? { ...s, ...action.updates } : s
      );
      return { ...state, problem: { ...state.problem, stages } };
    }

    case 'SAVE_PROBLEM':
      return { ...state, problem: { ...state.problem, savedAt: new Date().toISOString() } };

    case 'RESET_ALL':
      return buildInitialState();

    default:
      return state;
  }
}

/* ============================================================
   CONTEXT
   ============================================================ */

const STORAGE_KEY = 'cyberforge_state';

interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getSkillGaps: () => SkillGap[];
  getBlockers: () => Blocker[];
  getTodaysTasks: () => Task[];
  getMemberProgress: (role: MemberRole) => number;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        // Validate it has the right shape
        if (parsed.team && parsed.skillCategories && parsed.learningPaths) {
          return parsed;
        }
      }
    } catch { /* ignore corrupt data */ }
    return buildInitialState();
  });

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getSkillGaps = useCallback((): SkillGap[] => {
    const gaps: SkillGap[] = [];
    for (const cat of state.skillCategories) {
      for (const entry of cat.skills) {
        const roles: MemberRole[] = ['lead', 'researcher', 'designer', 'presenter'];
        for (const role of roles) {
          if (entry[role] === 'not-started' || entry[role] === 'learning') {
            gaps.push({ skill: entry.skill, member: role, currentStatus: entry[role] });
          }
        }
      }
    }
    return gaps;
  }, [state.skillCategories]);

  const getBlockers = useCallback((): Blocker[] => {
    return state.tasks
      .filter(t => t.status === 'blocked')
      .map(t => ({
        id: t.id,
        member: t.owner,
        description: t.title,
        severity: t.priority === 'high' ? 'high' as const : 'medium' as const,
      }));
  }, [state.tasks]);

  const getTodaysTasks = useCallback((): Task[] => {
    return state.tasks.filter(t => t.status === 'today');
  }, [state.tasks]);

  const getMemberProgress = useCallback((role: MemberRole): number => {
    const member = state.team.find(m => m.role === role);
    return member?.progress ?? 0;
  }, [state.team]);

  return (
    <AppStateContext.Provider value={{ state, dispatch, getSkillGaps, getBlockers, getTodaysTasks, getMemberProgress }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
