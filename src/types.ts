export interface MatchedSkill {
  skill: string;
  category: string;
  foundInResume: string;
}

export interface MissingSkill {
  skill: string;
  category: string;
  importance: "critical" | "preferred" | "bonus" | string;
  whereInJobDesc?: string;
  whyItMatters: string;
  bridgingAdvice: string;
}

export interface StrengthItem {
  title: string;
  description: string;
  resumeEvidence: string;
}

export interface AreaToImprove {
  title: string;
  description: string;
  actionItem: string;
}

export interface InterviewQuestion {
  id: string;
  category: "technical" | "behavioral" | "situational" | "gap_defense" | string;
  categoryLabel: string;
  question: string;
  contextWhyAsked: string;
  tipsOrStarGuide: string;
  sampleGoodResponse: string;
}

export interface BulletPointSuggestion {
  originalBullet: string;
  rewrittenBullet: string;
  rationale: string;
  impactNote: string;
  tags: string[];
}

export interface QuickStudyStep {
  stepOrDay: string;
  focusSkill: string;
  resourceOrAction: string;
  keyConcept: string;
}

export interface AnalysisResult {
  overallMatchScore: number;
  matchTier: string;
  verdictSummary: string;
  targetJobTitle: string;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  strengths: StrengthItem[];
  areasToImprove: AreaToImprove[];
  interviewQuestions: InterviewQuestion[];
  bulletPointSuggestions: BulletPointSuggestion[];
  quickStudyPlan: QuickStudyStep[];
  analyzedAt?: string;
  isOfflineDemo?: boolean;
}

export interface EvaluationResult {
  score: number;
  scoreLabel: string;
  strengthsInAnswer: string[];
  improvementsNeeded: string[];
  polishedAnswer: string;
  keyTakeawayTip: string;
}

export interface BulletRewriteVariation {
  style: string;
  rewrittenText: string;
  actionVerbUsed: string;
  explanation: string;
}

export interface BulletRewriteResult {
  variations: BulletRewriteVariation[];
  quickTip: string;
}

export interface PresetSample {
  id: string;
  name: string;
  subtitle: string;
  roleTitle: string;
  companyName: string;
  resumeText: string;
  jobDescriptionText: string;
}
