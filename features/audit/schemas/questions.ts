export type CapabilityDomain =
  | 'role_clarity'
  | 'documentation_maturity'
  | 'decision_ownership'
  | 'kpi_maturity'
  | 'process_structure';

export interface AuditQuestion {
  key: string;
  text: string;
  domain: CapabilityDomain;
  weight: number;
  options: {
    value: string;
    label: string;
    points: number;
  }[];
}

export const DOMAIN_LABELS: Record<CapabilityDomain, string> = {
  role_clarity: 'Role Clarity',
  documentation_maturity: 'Documentation Maturity',
  decision_ownership: 'Decision Ownership',
  kpi_maturity: 'KPI Maturity',
  process_structure: 'Process Structure',
};

export const AUDIT_QUESTIONS: AuditQuestion[] = [
  // Role Clarity (5 questions)
  {
    key: 'rc_1',
    text: 'Does every employee have a clearly defined role title?',
    domain: 'role_clarity',
    weight: 3,
    options: [
      { value: 'yes', label: 'Yes, all roles are clearly defined', points: 3 },
      { value: 'partial', label: 'Some roles are defined, others are informal', points: 1 },
      { value: 'no', label: 'No, roles are mostly informal', points: 0 },
    ],
  },
  {
    key: 'rc_2',
    text: 'Are reporting lines (who reports to whom) documented and communicated?',
    domain: 'role_clarity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, there is a clear org chart', points: 3 },
      { value: 'partial', label: 'Reporting lines exist but are not always clear', points: 1 },
      { value: 'no', label: 'No formal reporting structure exists', points: 0 },
    ],
  },
  {
    key: 'rc_3',
    text: 'Do team members understand where their responsibilities start and end?',
    domain: 'role_clarity',
    weight: 3,
    options: [
      { value: 'yes', label: 'Yes, boundaries are well defined', points: 3 },
      { value: 'partial', label: 'There is frequent overlap or confusion', points: 1 },
      { value: 'no', label: 'Responsibilities are very unclear', points: 0 },
    ],
  },
  {
    key: 'rc_4',
    text: 'Are there clear seniority levels or career progression paths?',
    domain: 'role_clarity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, levels and progression are defined', points: 3 },
      { value: 'partial', label: 'Some levels exist but progression is unclear', points: 1 },
      { value: 'no', label: 'No defined levels or progression paths', points: 0 },
    ],
  },
  {
    key: 'rc_5',
    text: 'When someone is hired, do they receive a list of specific responsibilities?',
    domain: 'role_clarity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, every new hire gets a detailed job description', points: 3 },
      { value: 'partial', label: 'Sometimes, but it is informal', points: 1 },
      { value: 'no', label: 'No, responsibilities are figured out on the job', points: 0 },
    ],
  },

  // Documentation Maturity (5 questions)
  {
    key: 'dm_1',
    text: 'Do you have written job descriptions for most roles?',
    domain: 'documentation_maturity',
    weight: 3,
    options: [
      { value: 'yes', label: 'Yes, for all or most roles', points: 3 },
      { value: 'partial', label: 'Only for some key roles', points: 1 },
      { value: 'no', label: 'No written job descriptions exist', points: 0 },
    ],
  },
  {
    key: 'dm_2',
    text: 'Is there an employee handbook or company policies document?',
    domain: 'documentation_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, comprehensive and up to date', points: 3 },
      { value: 'partial', label: 'Exists but outdated or incomplete', points: 1 },
      { value: 'no', label: 'No handbook or formal policies', points: 0 },
    ],
  },
  {
    key: 'dm_3',
    text: 'Are onboarding processes documented and standardized?',
    domain: 'documentation_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, there is a structured onboarding process', points: 3 },
      { value: 'partial', label: 'Onboarding varies person to person', points: 1 },
      { value: 'no', label: 'No formal onboarding process', points: 0 },
    ],
  },
  {
    key: 'dm_4',
    text: 'Are standard operating procedures (SOPs) documented for key workflows?',
    domain: 'documentation_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, key workflows have SOPs', points: 3 },
      { value: 'partial', label: 'Some processes are documented', points: 1 },
      { value: 'no', label: 'Nothing is documented', points: 0 },
    ],
  },
  {
    key: 'dm_5',
    text: 'Do you use templates for recurring HR tasks (offer letters, reviews, etc.)?',
    domain: 'documentation_maturity',
    weight: 1,
    options: [
      { value: 'yes', label: 'Yes, standardized templates are used', points: 3 },
      { value: 'partial', label: 'Some templates exist', points: 1 },
      { value: 'no', label: 'Everything is done ad hoc', points: 0 },
    ],
  },

  // Decision Ownership (5 questions)
  {
    key: 'do_1',
    text: 'Is it clear who has decision-making authority for key business areas?',
    domain: 'decision_ownership',
    weight: 3,
    options: [
      { value: 'yes', label: 'Yes, decision rights are well defined', points: 3 },
      { value: 'partial', label: 'Some areas are clear, others are ambiguous', points: 1 },
      { value: 'no', label: 'Decisions are made ad hoc', points: 0 },
    ],
  },
  {
    key: 'do_2',
    text: 'Do you use a RACI matrix or similar to map responsibilities?',
    domain: 'decision_ownership',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, we have formal responsibility mapping', points: 3 },
      { value: 'partial', label: 'Informally, but not documented', points: 1 },
      { value: 'no', label: 'No responsibility mapping exists', points: 0 },
    ],
  },
  {
    key: 'do_3',
    text: 'When a cross-functional issue arises, is the escalation path clear?',
    domain: 'decision_ownership',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, escalation paths are defined', points: 3 },
      { value: 'partial', label: 'People usually figure it out', points: 1 },
      { value: 'no', label: 'There is frequent confusion', points: 0 },
    ],
  },
  {
    key: 'do_4',
    text: 'Are there regular meetings where decisions and action items are tracked?',
    domain: 'decision_ownership',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, decisions are tracked and followed up', points: 3 },
      { value: 'partial', label: 'Meetings happen but follow-up is inconsistent', points: 1 },
      { value: 'no', label: 'Decisions are rarely tracked', points: 0 },
    ],
  },
  {
    key: 'do_5',
    text: 'Can employees make decisions within their role without unnecessary approval?',
    domain: 'decision_ownership',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, empowerment is part of the culture', points: 3 },
      { value: 'partial', label: 'Depends on the situation', points: 1 },
      { value: 'no', label: 'Most things require founder/manager approval', points: 0 },
    ],
  },

  // KPI Maturity (5 questions)
  {
    key: 'km_1',
    text: 'Do individual roles have defined KPIs or performance metrics?',
    domain: 'kpi_maturity',
    weight: 3,
    options: [
      { value: 'yes', label: 'Yes, every role has clear KPIs', points: 3 },
      { value: 'partial', label: 'Some roles have KPIs', points: 1 },
      { value: 'no', label: 'No KPIs are defined', points: 0 },
    ],
  },
  {
    key: 'km_2',
    text: 'Are performance reviews conducted regularly?',
    domain: 'kpi_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, at least annually with clear criteria', points: 3 },
      { value: 'partial', label: 'Occasionally, but not structured', points: 1 },
      { value: 'no', label: 'No performance reviews are conducted', points: 0 },
    ],
  },
  {
    key: 'km_3',
    text: 'Do you track team-level metrics (output, quality, satisfaction)?',
    domain: 'kpi_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, dashboards or reports are used', points: 3 },
      { value: 'partial', label: 'Some metrics are tracked informally', points: 1 },
      { value: 'no', label: 'No team metrics are tracked', points: 0 },
    ],
  },
  {
    key: 'km_4',
    text: 'Are goals aligned between individual, team, and company levels?',
    domain: 'kpi_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, using OKRs or goal cascading', points: 3 },
      { value: 'partial', label: 'Some alignment, but not systematic', points: 1 },
      { value: 'no', label: 'No formal goal alignment', points: 0 },
    ],
  },
  {
    key: 'km_5',
    text: 'Is there a feedback loop where KPI results inform process improvements?',
    domain: 'kpi_maturity',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, data-driven improvements are made', points: 3 },
      { value: 'partial', label: 'Sometimes, when issues are obvious', points: 1 },
      { value: 'no', label: 'No systematic feedback loop', points: 0 },
    ],
  },

  // Process Structure (5 questions)
  {
    key: 'ps_1',
    text: 'Are hiring processes standardized (interview stages, criteria, evaluation)?',
    domain: 'process_structure',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, fully standardized', points: 3 },
      { value: 'partial', label: 'Somewhat, but varies by role or manager', points: 1 },
      { value: 'no', label: 'Hiring is mostly informal', points: 0 },
    ],
  },
  {
    key: 'ps_2',
    text: 'Is there a defined process for handling employee issues or conflicts?',
    domain: 'process_structure',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, clear escalation and resolution process', points: 3 },
      { value: 'partial', label: 'Handled case by case', points: 1 },
      { value: 'no', label: 'No defined process', points: 0 },
    ],
  },
  {
    key: 'ps_3',
    text: 'Is there a structured offboarding process when employees leave?',
    domain: 'process_structure',
    weight: 1,
    options: [
      { value: 'yes', label: 'Yes, with checklist and knowledge transfer', points: 3 },
      { value: 'partial', label: 'Basic steps exist', points: 1 },
      { value: 'no', label: 'No formal offboarding', points: 0 },
    ],
  },
  {
    key: 'ps_4',
    text: 'Do internal workflows (approvals, requests) follow defined processes?',
    domain: 'process_structure',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, processes are documented and followed', points: 3 },
      { value: 'partial', label: 'Some processes exist', points: 1 },
      { value: 'no', label: 'Everything is done ad hoc', points: 0 },
    ],
  },
  {
    key: 'ps_5',
    text: 'Is there a regular cadence (weekly/monthly) for reviewing organizational health?',
    domain: 'process_structure',
    weight: 2,
    options: [
      { value: 'yes', label: 'Yes, regular reviews happen', points: 3 },
      { value: 'partial', label: 'Occasionally, when issues arise', points: 1 },
      { value: 'no', label: 'Never reviewed systematically', points: 0 },
    ],
  },
];
