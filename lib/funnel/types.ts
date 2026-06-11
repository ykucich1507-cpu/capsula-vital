export type FunnelStage = 'awareness' | 'interest' | 'consideration' | 'intent' | 'purchase' | 'retention';
export type LeadStatus = 'new' | 'chatting' | 'qualified' | 'interested' | 'hot' | 'converted' | 'lost';
export type BusinessType = 'ecommerce' | 'service' | 'saas' | 'b2b' | 'restaurant' | 'real_estate' | 'health' | 'education' | 'custom';

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  score: number;
  stage: FunnelStage;
  tags: string[];
  chatHistory: ChatMessage[];
  customFields: Record<string, unknown>;
  utm: UTMParams;
  qualification: LeadQualification;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface LeadQualification {
  budget?: string;
  timeline?: string;
  painPoints: string[];
  interests: string[];
  objections: string[];
  readyToBuy?: boolean;
}

export interface BusinessConfig {
  id: string;
  name: string;
  type: BusinessType;
  industry: string;
  product: string;
  description: string;
  price?: number;
  currency: string;
  whatsappNumber?: string;
  funnel: FunnelConfig;
  qualification: QualificationConfig;
  followUp: FollowUpConfig;
  createdAt: string;
}

export interface FunnelConfig {
  slug: string;
  headline: string;
  subheadline: string;
  cta: string;
  benefits: string[];
  urgency?: string;
  socialProof?: { count: number; label: string };
  colors?: { primary: string; accent: string };
  heroImage?: string;
}

export interface QualificationConfig {
  greeting: string;
  systemPrompt: string;
  minScoreForHot: number;
}

export interface FollowUpConfig {
  immediateMessage: string;
  dayOneMessage?: string;
  dayThreeMessage?: string;
  enabled: boolean;
}

export interface FunnelStats {
  businessId: string;
  totalLeads: number;
  byStatus: Record<LeadStatus, number>;
  byStage: Record<FunnelStage, number>;
  averageScore: number;
  conversionRate: number;
  hotLeads: number;
  todayLeads: number;
  weekLeads: number;
  revenueEstimated: number;
}
