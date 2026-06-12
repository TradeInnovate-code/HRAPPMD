import type { AuditAnswer, AuditResult, AuditDomainScore } from '../schemas/audit.schemas';
import { AUDIT_QUESTIONS, DOMAIN_LABELS, type CapabilityDomain } from '../schemas/questions';

interface ScoringInput {
  answers: AuditAnswer[];
}

export function calculateAuditScore(input: ScoringInput): AuditResult {
  const { answers } = input;
  const answerMap = new Map(answers.map((a) => [a.questionKey, a.answerValue]));

  // Calculate per-domain scores
  const domainTotals: Record<CapabilityDomain, { earned: number; possible: number }> = {
    role_clarity: { earned: 0, possible: 0 },
    documentation_maturity: { earned: 0, possible: 0 },
    decision_ownership: { earned: 0, possible: 0 },
    kpi_maturity: { earned: 0, possible: 0 },
    process_structure: { earned: 0, possible: 0 },
  };

  for (const question of AUDIT_QUESTIONS) {
    const domain = question.domain;
    const maxPoints = Math.max(...question.options.map((o) => o.points));
    const weightedMax = maxPoints * question.weight;
    domainTotals[domain].possible += weightedMax;

    const userAnswer = answerMap.get(question.key);
    if (userAnswer) {
      const option = question.options.find((o) => o.value === userAnswer);
      if (option) {
        domainTotals[domain].earned += option.points * question.weight;
      }
    }
  }

  // Normalize each domain to 0-100
  const domainScores: AuditDomainScore[] = Object.entries(domainTotals).map(
    ([domain, { earned, possible }]) => ({
      domain,
      score: possible > 0 ? Math.round((earned / possible) * 100) : 0,
      maxScore: 100,
      label: DOMAIN_LABELS[domain as CapabilityDomain],
    }),
  );

  // Overall = average of domain scores
  const overallScore = Math.round(
    domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length,
  );

  // Identify issues
  const topIssues = identifyIssues(domainScores, answerMap);

  // Recommended actions based on lowest scoring domains
  const recommendedActions = generateRecommendations(domainScores);

  return {
    overallScore,
    domainScores,
    topIssues,
    recommendedActions,
  };
}

function identifyIssues(domainScores: AuditDomainScore[], answerMap: Map<string, string>) {
  const issues: AuditResult['topIssues'] = [];
  let issueId = 0;

  for (const ds of domainScores) {
    if (ds.score < 40) {
      issues.push({
        id: `issue_${++issueId}`,
        title: `Critical gap in ${ds.label}`,
        severity: 'high',
        domain: ds.domain,
      });
    } else if (ds.score < 70) {
      issues.push({
        id: `issue_${++issueId}`,
        title: `${ds.label} needs improvement`,
        severity: 'medium',
        domain: ds.domain,
      });
    }
  }

  // Check for specific critical questions answered negatively
  const criticalQuestions = AUDIT_QUESTIONS.filter((q) => q.weight >= 3);
  for (const q of criticalQuestions) {
    const answer = answerMap.get(q.key);
    if (answer === 'no') {
      issues.push({
        id: `issue_${++issueId}`,
        title: q.text.replace(/\?$/, ''),
        severity: 'high',
        domain: q.domain,
      });
    }
  }

  // Sort by severity and limit
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]).slice(0, 8);
}

function generateRecommendations(domainScores: AuditDomainScore[]): string[] {
  const recommendations: string[] = [];
  const sorted = [...domainScores].sort((a, b) => a.score - b.score);

  for (const ds of sorted) {
    if (ds.score < 40) {
      recommendations.push(
        ...getRecommendationsForDomain(ds.domain as CapabilityDomain, 'critical'),
      );
    } else if (ds.score < 70) {
      recommendations.push(
        ...getRecommendationsForDomain(ds.domain as CapabilityDomain, 'improvement'),
      );
    }
  }

  return recommendations.slice(0, 6);
}

function getRecommendationsForDomain(
  domain: CapabilityDomain,
  level: 'critical' | 'improvement',
): string[] {
  const recs: Record<CapabilityDomain, Record<string, string[]>> = {
    role_clarity: {
      critical: [
        'Define formal job titles and responsibilities for every team member immediately',
        'Create an organizational chart showing reporting lines',
      ],
      improvement: [
        'Review and update role definitions to eliminate overlaps',
        'Implement career progression frameworks',
      ],
    },
    documentation_maturity: {
      critical: [
        'Create job descriptions for all roles using the HRI Job Description Generator',
        'Develop a basic employee handbook with core policies',
      ],
      improvement: [
        'Standardize onboarding documentation',
        'Create SOP templates for recurring workflows',
      ],
    },
    decision_ownership: {
      critical: [
        'Build a RACI matrix to map decision-making authority',
        'Define escalation paths for cross-functional issues',
      ],
      improvement: [
        'Implement action item tracking in regular meetings',
        'Empower team leads with defined decision rights',
      ],
    },
    kpi_maturity: {
      critical: [
        'Define 3-5 KPIs for each role starting with senior positions',
        'Implement quarterly performance review cycles',
      ],
      improvement: [
        'Align individual KPIs with team and company goals using OKRs',
        'Build feedback loops between KPI results and process improvements',
      ],
    },
    process_structure: {
      critical: [
        'Standardize your hiring process with defined interview stages',
        'Create a structured offboarding checklist',
      ],
      improvement: [
        'Document internal approval workflows',
        'Establish monthly organizational health reviews',
      ],
    },
  };

  return recs[domain]?.[level] ?? [];
}
