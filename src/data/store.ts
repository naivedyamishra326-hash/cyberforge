import type { TeamMember, RoadmapDay, SkillCategory, Task, Resource, Blocker, SkillGap } from '../types';

/* ============================================================
   TEAM
   ============================================================ */

export const team: TeamMember[] = [
  {
    id: 'navi',
    name: 'Naivedya',
    role: 'lead',
    title: 'Team Lead / Developer / Security Researcher',
    primaryTrack: 'AI + Security',
    secondaryTrack: 'Full-Stack',
    currentFocus: 'Web Security',
    currentTask: 'Security analysis API',
    progress: 78,
    color: 'cyan',
    initials: 'NA',
  },
  {
    id: 'researcher',
    name: 'Satwik',
    role: 'researcher',
    title: 'Security Researcher',
    primaryTrack: 'Threat Intelligence',
    secondaryTrack: 'Python / ML',
    currentFocus: 'HTTP Vulnerabilities',
    currentTask: 'OWASP attack research',
    progress: 62,
    color: 'green',
    initials: 'SA',
  },
  {
    id: 'designer',
    name: 'Mohit',
    role: 'designer',
    title: 'Product Designer',
    primaryTrack: 'Security UX',
    secondaryTrack: 'Design Systems',
    currentFocus: 'Security Dashboards',
    currentTask: 'Auth flow wireframes',
    progress: 71,
    color: 'blue',
    initials: 'MO',
  },
  {
    id: 'presenter',
    name: 'Pragna',
    role: 'presenter',
    title: 'Presenter / Developer',
    primaryTrack: 'Frontend Dev',
    secondaryTrack: 'Documentation',
    currentFocus: 'API Integration',
    currentTask: 'Demo page scaffold',
    progress: 55,
    color: 'amber',
    initials: 'PR',
  },
];

export function getMember(role: string): TeamMember {
  return team.find((m) => m.role === role) ?? team[0];
}

export function getMemberName(role: string): string {
  return getMember(role).name;
}

/* ============================================================
   ROADMAP — 12 DAYS
   ============================================================ */

export const roadmap: RoadmapDay[] = [
  {
    day: 1,
    title: 'Foundation',
    subtitle: 'Cybersecurity fundamentals & team setup',
    objectives: ['Understand CIA triad', 'Security mindset', 'Threat landscape overview', 'Team workflow setup'],
    teamAssignments: {
      lead: 'Architecture setup & tooling',
      researcher: 'Threat landscape survey',
      designer: 'Design system foundation',
      presenter: 'Git workflow & documentation structure',
    },
    exercise: 'Identify vulnerabilities in a sample app',
    deliverable: 'Team charter + initial security audit report',
    estimatedHours: 6,
    prerequisites: [],
  },
  {
    day: 2,
    title: 'Networking',
    subtitle: 'TCP/IP, DNS, HTTP fundamentals',
    objectives: ['TCP/IP stack', 'DNS resolution', 'Port scanning basics', 'Network security concepts'],
    teamAssignments: {
      lead: 'Network scanner prototype',
      researcher: 'Protocol vulnerability research',
      designer: 'Network visualization concepts',
      presenter: 'Networking documentation',
    },
    exercise: 'Use Wireshark to analyze network traffic',
    deliverable: 'Network analysis report',
    estimatedHours: 6,
    prerequisites: ['Day 1 — Foundation'],
  },
  {
    day: 3,
    title: 'Linux',
    subtitle: 'Linux security & command line',
    objectives: ['Linux file system', 'Permissions model', 'Process management', 'Security hardening'],
    teamAssignments: {
      lead: 'Linux automation scripts',
      researcher: 'Permission escalation research',
      designer: 'CLI interface concepts',
      presenter: 'Linux command cheatsheet',
    },
    exercise: 'Harden a Linux server configuration',
    deliverable: 'Hardening checklist + scripts',
    estimatedHours: 5,
    prerequisites: ['Day 2 — Networking'],
  },
  {
    day: 4,
    title: 'Web Security',
    subtitle: 'HTTP, sessions, authentication, OWASP',
    objectives: ['HTTP protocol deep dive', 'Cookie & session security', 'Authentication patterns', 'OWASP Top 10 basics'],
    teamAssignments: {
      lead: 'Security implementation',
      researcher: 'Attack vector research',
      designer: 'Security UX patterns',
      presenter: 'Documentation + demo setup',
    },
    exercise: 'Build a web-security analysis exercise',
    deliverable: 'Security analysis tool MVP',
    estimatedHours: 7,
    prerequisites: ['Day 3 — Linux'],
  },
  {
    day: 5,
    title: 'Cryptography',
    subtitle: 'Encryption, hashing, digital signatures',
    objectives: ['Symmetric vs asymmetric encryption', 'Hashing algorithms', 'Digital signatures', 'PKI fundamentals'],
    teamAssignments: {
      lead: 'Crypto module implementation',
      researcher: 'Cryptographic attack research',
      designer: 'Encryption flow visualization',
      presenter: 'Crypto demo prep',
    },
    exercise: 'Implement encryption/decryption pipeline',
    deliverable: 'Working crypto demonstration',
    estimatedHours: 6,
    prerequisites: ['Day 4 — Web Security'],
  },
  {
    day: 6,
    title: 'Python + APIs',
    subtitle: 'Python scripting & REST API development',
    objectives: ['Python for security', 'REST API design', 'API authentication', 'Rate limiting & security'],
    teamAssignments: {
      lead: 'API server architecture',
      researcher: 'API vulnerability scanning',
      designer: 'API documentation UX',
      presenter: 'API integration & testing',
    },
    exercise: 'Build a secure REST API endpoint',
    deliverable: 'Secure API with authentication',
    estimatedHours: 7,
    prerequisites: ['Day 5 — Cryptography'],
  },
  {
    day: 7,
    title: 'ML Security',
    subtitle: 'Machine learning for security applications',
    objectives: ['ML fundamentals', 'Anomaly detection', 'Classification for threats', 'Model security'],
    teamAssignments: {
      lead: 'ML pipeline implementation',
      researcher: 'Adversarial ML research',
      designer: 'ML results visualization',
      presenter: 'ML explainability demo',
    },
    exercise: 'Train an anomaly detection model on network data',
    deliverable: 'Working anomaly detector',
    estimatedHours: 8,
    prerequisites: ['Day 6 — Python + APIs'],
  },
  {
    day: 8,
    title: 'LLM + RAG',
    subtitle: 'Large language models & retrieval-augmented generation',
    objectives: ['LLM capabilities', 'Prompt engineering', 'RAG architecture', 'Vector databases'],
    teamAssignments: {
      lead: 'RAG pipeline implementation',
      researcher: 'LLM security risks research',
      designer: 'Chat UX design',
      presenter: 'RAG demo preparation',
    },
    exercise: 'Build a security-focused RAG system',
    deliverable: 'RAG-powered security assistant prototype',
    estimatedHours: 8,
    prerequisites: ['Day 7 — ML Security'],
  },
  {
    day: 9,
    title: 'AI Security',
    subtitle: 'Securing AI systems & AI for security',
    objectives: ['AI attack vectors', 'Prompt injection', 'Model poisoning', 'AI-powered defense'],
    teamAssignments: {
      lead: 'AI security integration',
      researcher: 'AI threat modeling',
      designer: 'Security alert UX',
      presenter: 'AI security case studies',
    },
    exercise: 'Red team an AI system for vulnerabilities',
    deliverable: 'AI security audit report',
    estimatedHours: 7,
    prerequisites: ['Day 8 — LLM + RAG'],
  },
  {
    day: 10,
    title: 'Mini Project',
    subtitle: 'Integrate all skills into a small project',
    objectives: ['Architecture review', 'Feature integration', 'Security testing', 'Team coordination'],
    teamAssignments: {
      lead: 'System integration lead',
      researcher: 'Security testing & audit',
      designer: 'UI polish & handoff',
      presenter: 'Documentation & demo flow',
    },
    exercise: 'Build an end-to-end mini security application',
    deliverable: 'Working mini project',
    estimatedHours: 8,
    prerequisites: ['Day 9 — AI Security'],
  },
  {
    day: 11,
    title: 'Mock Problem',
    subtitle: 'Simulate receiving a hackathon problem',
    objectives: ['Problem analysis', 'Rapid architecture', 'Time-boxed implementation', 'Team execution test'],
    teamAssignments: {
      lead: 'Architecture & coordination',
      researcher: 'Problem research & threat model',
      designer: 'Rapid prototyping',
      presenter: 'Demo preparation',
    },
    exercise: 'Solve a mock problem statement in 4 hours',
    deliverable: 'Mock solution + retrospective',
    estimatedHours: 8,
    prerequisites: ['Day 10 — Mini Project'],
  },
  {
    day: 12,
    title: 'Full Simulation',
    subtitle: 'Complete hackathon dry run',
    objectives: ['Full problem solving cycle', 'Presentation rehearsal', 'Time management', 'Final readiness check'],
    teamAssignments: {
      lead: 'Full execution lead',
      researcher: 'Security implementation',
      designer: 'Final UI & presentation design',
      presenter: 'Final pitch rehearsal',
    },
    exercise: 'Full 6-hour hackathon simulation',
    deliverable: 'Complete solution + polished presentation',
    estimatedHours: 8,
    prerequisites: ['Day 11 — Mock Problem'],
  },
];

/* ============================================================
   SKILLS
   ============================================================ */

export const skillCategories: SkillCategory[] = [
  {
    name: 'Cybersecurity',
    skills: [
      { skill: 'Security Fundamentals', lead: 'comfortable',  researcher: 'comfortable',  designer: 'learning',    presenter: 'learning'    },
      { skill: 'Networking',            lead: 'practicing',   researcher: 'comfortable',  designer: 'not-started', presenter: 'learning'    },
      { skill: 'Linux Security',        lead: 'comfortable',  researcher: 'practicing',   designer: 'not-started', presenter: 'not-started' },
      { skill: 'HTTP / Web Security',   lead: 'practicing',   researcher: 'learning',     designer: 'learning',    presenter: 'learning'    },
      { skill: 'Cryptography',          lead: 'learning',     researcher: 'practicing',   designer: 'not-started', presenter: 'not-started' },
      { skill: 'OWASP Top 10',          lead: 'learning',     researcher: 'learning',     designer: 'not-started', presenter: 'not-started' },
    ],
  },
  {
    name: 'AI / ML',
    skills: [
      { skill: 'Machine Learning',     lead: 'practicing',  researcher: 'learning',    designer: 'not-started', presenter: 'not-started' },
      { skill: 'Anomaly Detection',    lead: 'learning',    researcher: 'learning',    designer: 'not-started', presenter: 'not-started' },
      { skill: 'LLMs',                 lead: 'practicing',  researcher: 'not-started', designer: 'not-started', presenter: 'learning'    },
      { skill: 'RAG',                  lead: 'learning',    researcher: 'not-started', designer: 'not-started', presenter: 'not-started' },
      { skill: 'AI Security',          lead: 'learning',    researcher: 'learning',    designer: 'not-started', presenter: 'not-started' },
    ],
  },
  {
    name: 'Development',
    skills: [
      { skill: 'Python',        lead: 'comfortable',  researcher: 'practicing',  designer: 'not-started', presenter: 'learning'    },
      { skill: 'REST APIs',     lead: 'comfortable',  researcher: 'learning',    designer: 'not-started', presenter: 'practicing'  },
      { skill: 'Git',           lead: 'can-teach',    researcher: 'comfortable', designer: 'practicing',  presenter: 'comfortable' },
      { skill: 'Frontend',      lead: 'comfortable',  researcher: 'not-started', designer: 'practicing',  presenter: 'practicing'  },
    ],
  },
  {
    name: 'Design',
    skills: [
      { skill: 'Figma',         lead: 'learning',     researcher: 'not-started', designer: 'can-teach',   presenter: 'learning'    },
      { skill: 'Security UX',   lead: 'not-started',  researcher: 'not-started', designer: 'practicing',  presenter: 'not-started' },
      { skill: 'Design Systems', lead: 'learning',    researcher: 'not-started', designer: 'comfortable', presenter: 'not-started' },
    ],
  },
  {
    name: 'Presentation',
    skills: [
      { skill: 'Technical Writing', lead: 'practicing',  researcher: 'learning',    designer: 'learning',    presenter: 'comfortable' },
      { skill: 'Demo Skills',       lead: 'learning',    researcher: 'not-started', designer: 'learning',    presenter: 'practicing'  },
      { skill: 'Pitch Delivery',    lead: 'not-started', researcher: 'not-started', designer: 'not-started', presenter: 'practicing'  },
    ],
  },
];

/* ============================================================
   TASKS
   ============================================================ */

export const tasks: Task[] = [
  { id: 't1', title: 'Build security analysis API endpoint', owner: 'lead',       status: 'today',    priority: 'high',   estimatedMinutes: 120, day: 4 },
  { id: 't2', title: 'Research OWASP Top 10 attack vectors',  owner: 'researcher', status: 'today',    priority: 'high',   estimatedMinutes: 90,  day: 4 },
  { id: 't3', title: 'Design authentication flow wireframes', owner: 'designer',   status: 'today',    priority: 'high',   estimatedMinutes: 60,  day: 4 },
  { id: 't4', title: 'Set up demo page scaffold',             owner: 'presenter',  status: 'today',    priority: 'medium', estimatedMinutes: 45,  day: 4 },
  { id: 't5', title: 'Implement session management',          owner: 'lead',       status: 'upcoming', priority: 'high',   estimatedMinutes: 90,  day: 4 },
  { id: 't6', title: 'Write HTTP security documentation',     owner: 'presenter',  status: 'upcoming', priority: 'medium', estimatedMinutes: 60,  day: 4 },
  { id: 't7', title: 'Review cookie security patterns',       owner: 'researcher', status: 'upcoming', priority: 'medium', estimatedMinutes: 45,  day: 4 },
  { id: 't8', title: 'Networking lab exercises',               owner: 'lead',       status: 'done',     priority: 'high',   estimatedMinutes: 120, day: 3 },
  { id: 't9', title: 'Linux permissions research',            owner: 'researcher', status: 'done',     priority: 'high',   estimatedMinutes: 90,  day: 3 },
  { id: 't10', title: 'CLI interface mockups',                owner: 'designer',   status: 'done',     priority: 'medium', estimatedMinutes: 60,  day: 3 },
];

/* ============================================================
   RESOURCES
   ============================================================ */

export const resources: Resource[] = [
  { id: 'r1', title: 'HTTP — The Definitive Guide (Selected Chapters)', category: 'cybersecurity', priority: 'core', description: 'Essential HTTP protocol knowledge for web security analysis', estimatedMinutes: 45, relevantMembers: ['lead', 'researcher', 'presenter'], day: 4 },
  { id: 'r2', title: 'OWASP Testing Guide v4', category: 'cybersecurity', priority: 'core', description: 'Systematic approach to testing web application security', estimatedMinutes: 60, relevantMembers: ['lead', 'researcher'], day: 4 },
  { id: 'r3', title: 'Web Authentication Best Practices', category: 'cybersecurity', priority: 'core', description: 'OAuth, JWT, and session management security patterns', estimatedMinutes: 30, relevantMembers: ['lead', 'designer', 'presenter'], day: 4 },
  { id: 'r4', title: 'Python Security Automation', category: 'development', priority: 'core', description: 'Using Python for automated security scanning and testing', estimatedMinutes: 90, relevantMembers: ['lead', 'researcher'], day: 6 },
  { id: 'r5', title: 'ML for Anomaly Detection', category: 'ai-ml', priority: 'core', description: 'Building anomaly detection models for security applications', estimatedMinutes: 120, relevantMembers: ['lead', 'researcher'], day: 7 },
  { id: 'r6', title: 'RAG Architecture Patterns', category: 'ai-ml', priority: 'core', description: 'Retrieval-augmented generation for security knowledge bases', estimatedMinutes: 90, relevantMembers: ['lead'], day: 8 },
  { id: 'r7', title: 'Security UX Patterns', category: 'design', priority: 'core', description: 'Designing interfaces that enhance security without sacrificing usability', estimatedMinutes: 45, relevantMembers: ['designer', 'presenter'], day: 4 },
  { id: 'r8', title: 'Technical Presentation Framework', category: 'presentation', priority: 'core', description: 'Structuring technical demos for maximum impact', estimatedMinutes: 30, relevantMembers: ['presenter', 'lead'], day: 11 },
  { id: 'r9', title: 'Wireshark Essentials', category: 'cybersecurity', priority: 'optional', description: 'Packet analysis for network security troubleshooting', estimatedMinutes: 60, relevantMembers: ['lead', 'researcher'], day: 2 },
  { id: 'r10', title: 'Figma for Security Dashboards', category: 'design', priority: 'optional', description: 'Design patterns for security monitoring interfaces', estimatedMinutes: 45, relevantMembers: ['designer'], day: 5 },
];

/* ============================================================
   COMPUTED DATA
   ============================================================ */

export const currentDay = 4;
export const totalDays = 12;
export const daysRemaining = totalDays - currentDay + 1; // includes today

export function getSkillGaps(): SkillGap[] {
  const gaps: SkillGap[] = [];
  for (const category of skillCategories) {
    for (const entry of category.skills) {
      const roles: Array<'lead' | 'researcher' | 'designer' | 'presenter'> = ['lead', 'researcher', 'designer', 'presenter'];
      for (const role of roles) {
        if (entry[role] === 'not-started' || entry[role] === 'learning') {
          gaps.push({ skill: entry.skill, member: role, currentStatus: entry[role] });
        }
      }
    }
  }
  return gaps;
}

export function getTopSkillGaps(count = 5): SkillGap[] {
  // Prioritize gaps in skills relevant to today
  return getSkillGaps().slice(0, count);
}

export function getBlockers(): Blocker[] {
  return [
    { id: 'b1', member: 'researcher', description: 'Needs HTTP prerequisite completed before OWASP testing', severity: 'medium' },
    { id: 'b2', member: 'designer', description: 'Waiting for API flow documentation to finalize auth wireframes', severity: 'low' },
  ];
}

export function getTodaysTasks(): Task[] {
  return tasks.filter((t) => t.status === 'today');
}

export function getTeamProgress(): number {
  return Math.round(team.reduce((sum, m) => sum + m.progress, 0) / team.length);
}
