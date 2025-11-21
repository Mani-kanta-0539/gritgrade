
export interface Score {
  score: number;
  summary: string;
  recommendations?: string[];
  details?: Record<string, any>;
}

export type ContentType = 'article' | 'video';

export interface UserGoals {
    targetScore: number;
    monthlyAuditGoal: number;
}

export interface CalendarReminder {
    date: string; // ISO Date string
    title: string;
    completed: boolean;
}

export interface UserProfile {
  displayName: string;
  role: string; // e.g., "Content Creator", "SEO Specialist"
  niche: string; // e.g., "Tech", "Lifestyle"
  platform: string; // e.g., "Blog", "YouTube", "Instagram"
  goal: string; // e.g., "Traffic", "Sales", "Brand Awareness"
  experience: string; // "Beginner", "Pro"
  bio?: string;
  photoURL?: string;
  goals?: UserGoals;
  reminders?: CalendarReminder[];
}

// --- Detailed Chart Interfaces ---

export interface Competitor {
    name: string;
    url?: string;
    score: number;
    similarity: number;
    wordCount?: number;
}

export interface ContentGap {
    topic: string;
    userCoverage: number;
    competitorCoverage: number;
}

export interface AngleRecommendation {
    title: string;
    potentialScore: number;
    competitionLevel: 'Low' | 'Medium' | 'High';
    description: string;
}

export interface DifferentiationMetrics {
    uniquenessScore: number; // 0-100
    semanticSimilarity: {
        competitorName: string;
        similarPercentage: number;
        uniquePercentage: number;
    }[];
    contentOverlap: {
        sharedTopics: number;
        uniqueTopics: number;
        totalTopics: number;
        overlapPercentage: number;
    };
    uniqueValueProps: string[];
    angleRecommendations?: AngleRecommendation[];
}

export interface KeywordMetric {
    keyword: string;
    density: string;
    status: 'Optimal' | 'High' | 'Low';
    count: number;
}

export interface HeadingMetric {
    tag: string; // H1, H2, etc
    count: number;
    status: 'Optimal' | 'Good' | 'Warning' | 'Missing';
}

export interface MetaMetric {
    length: number;
    status: 'Optimal' | 'Too Short' | 'Too Long' | 'Missing';
    preview: string;
}

export interface VoiceSearchMetric {
    questionFormatScore: number;
    conversationalToneScore: number;
    snippetPotentialScore: number;
}

// Humanization Specifics
export interface AIPattern {
    pattern: string;
    status: 'Detected' | 'Not Detected';
    confidence: number;
}

export interface SentenceComplexity {
    varietyScore: number;
    avgLength: number;
    simplePercent: number;
    compoundPercent: number;
    complexPercent: number;
    compoundComplexPercent: number;
}

export interface ToneVoice {
    primaryTone: string;
    secondaryTone: string;
    consistencyScore: number;
    appropriatenessScore: number;
    characteristics: string[];
}

export interface ConversationalMetrics {
    score: number;
    activeVoicePercent: number;
    pronounsCount: string;
    contractionsCount: number;
}

export interface AnalysisResult {
  contentType: ContentType;
  topic?: string;
  speechReview?: string;
  
  // Article Dimensions
  seo?: Score;
  serp?: Score;
  aeo?: Score;
  humanization?: Score;
  differentiation?: Score;
  
  // Granular Data for Charts
  keywords?: KeywordMetric[];
  contentGaps?: ContentGap[];
  differentiationMetrics?: DifferentiationMetrics;
  
  // New Granular Details
  headingStructure?: HeadingMetric[];
  metaDescription?: MetaMetric;
  voiceSearch?: VoiceSearchMetric;
  
  // Humanization Granular Details
  aiPatterns?: AIPattern[];
  sentenceComplexity?: SentenceComplexity;
  toneVoice?: ToneVoice;
  conversational?: ConversationalMetrics;
  
  // Technical Details
  wordCount: number;
  recommendedWordCount: number;
  readingLevel: string;
  
  // Extended Article Dimensions
  freshness?: Score;
  linking?: Score;
  tone?: Score;
  accessibility?: Score;
  contentDepth?: Score;
  sentiment?: Score;
  
  // Video Dimensions
  hook?: Score;
  caption?: Score;
  hashtags?: Score;
  visuals?: Score;
  trend?: Score;
  engagement?: Score;
  
  overall: {
    score: number;
    summary: string;
  };
  competitors: Competitor[];
}

export interface HistoricAnalysisResult extends AnalysisResult {
    id: string;
    timestamp: number;
    query: string;
}

export type DimensionKey = 
  | 'seo' | 'serp' | 'aeo' | 'humanization' | 'differentiation' 
  | 'freshness' | 'engagement' | 'linking' | 'tone' | 'accessibility'
  | 'contentDepth' | 'sentiment'
  | 'hook' | 'caption' | 'hashtags' | 'visuals' | 'trend';
