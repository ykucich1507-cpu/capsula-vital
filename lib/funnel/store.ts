import { Lead, BusinessConfig, LeadStatus, FunnelStage } from './types';

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const DEMO_LEADS: Lead[] = [
  {
    id: 'lead_001', businessId: 'yani-trend', name: 'María García', phone: '+5491122334455',
    email: 'maria@email.com', status: 'converted', score: 92, stage: 'purchase',
    tags: ['compradora', 'aspiradora'], chatHistory: [], customFields: {},
    utm: { source: 'facebook', medium: 'paid', campaign: 'aspiradora-robot' },
    qualification: { budget: 'flexible', timeline: 'inmediato', painPoints: ['poco tiempo para limpiar'], interests: ['tecnología del hogar'], objections: [], readyToBuy: true },
    createdAt: daysAgo(6), updatedAt: daysAgo(5),
  },
  {
    id: 'lead_002', businessId: 'yani-trend', name: 'Carlos López', phone: '+5491133445566',
    status: 'hot', score: 78, stage: 'intent',
    tags: ['caliente', 'precio'], chatHistory: [], customFields: {},
    utm: { source: 'instagram', medium: 'paid', campaign: 'aspiradora-robot' },
    qualification: { budget: 'moderado', timeline: 'esta semana', painPoints: ['mascotas en casa'], interests: ['ahorro de tiempo'], objections: ['precio alto'], readyToBuy: false },
    createdAt: daysAgo(4), updatedAt: daysAgo(3),
  },
  {
    id: 'lead_003', businessId: 'yani-trend', name: 'Laura Martínez', phone: '+5491144556677',
    status: 'interested', score: 65, stage: 'consideration',
    tags: ['tibia', 'seguimiento'], chatHistory: [], customFields: {},
    utm: { source: 'facebook', medium: 'paid', campaign: 'aspiradora-robot' },
    qualification: { budget: 'limitado', timeline: 'próximo mes', painPoints: ['departamento grande'], interests: ['automatización'], objections: ['duda de calidad'], readyToBuy: false },
    createdAt: daysAgo(3), updatedAt: daysAgo(2),
  },
  {
    id: 'lead_004', businessId: 'yani-trend', name: 'Ana Rodríguez', phone: '+5491155667788',
    status: 'converted', score: 95, stage: 'purchase',
    tags: ['vip', 'referido'], chatHistory: [], customFields: {},
    utm: { source: 'organic', medium: 'social' },
    qualification: { budget: 'flexible', timeline: 'inmediato', painPoints: ['no quiero limpiar'], interests: ['smart home'], objections: [], readyToBuy: true },
    createdAt: daysAgo(2), updatedAt: daysAgo(1),
  },
  {
    id: 'lead_005', businessId: 'yani-trend', name: 'Diego Torres', phone: '+5491166778899',
    status: 'qualified', score: 55, stage: 'interest',
    tags: ['nuevo'], chatHistory: [], customFields: {},
    utm: { source: 'facebook', medium: 'paid', campaign: 'black-friday' },
    qualification: { budget: 'desconocido', timeline: 'explorando', painPoints: ['casa grande'], interests: ['robots'], objections: ['no conozco la marca'], readyToBuy: false },
    createdAt: daysAgo(1), updatedAt: daysAgo(0),
  },
  {
    id: 'lead_006', businessId: 'yani-trend', name: 'Sofía Peralta', phone: '+5491177889900',
    status: 'hot', score: 85, stage: 'intent',
    tags: ['caliente', 'hoy'], chatHistory: [], customFields: {},
    utm: { source: 'whatsapp', medium: 'referral' },
    qualification: { budget: 'bueno', timeline: 'hoy', painPoints: ['alergia al polvo'], interests: ['limpieza automática'], objections: [], readyToBuy: true },
    createdAt: daysAgo(0), updatedAt: daysAgo(0),
  },
  {
    id: 'lead_007', businessId: 'yani-trend', name: 'Martín Suárez', phone: '+5491188990011',
    status: 'new', score: 30, stage: 'awareness',
    tags: ['nuevo', 'frío'], chatHistory: [], customFields: {},
    utm: { source: 'facebook', medium: 'paid', campaign: 'aspiradora-robot' },
    qualification: { painPoints: [], interests: [], objections: [] },
    createdAt: daysAgo(0), updatedAt: daysAgo(0),
  },
];

const DEMO_CONFIG: BusinessConfig = {
  id: 'yani-trend',
  name: 'Yani Trend',
  type: 'ecommerce',
  industry: 'Hogar & Tecnología',
  product: 'Aspiradora Robot Jessica',
  description: 'Tienda online de productos de hogar y tecnología con pago contra entrega',
  price: 38630,
  currency: 'ARS',
  whatsappNumber: '5491154321234',
  funnel: {
    slug: 'aspiradora-robot',
    headline: '¡Nunca más limpies el piso tú mismo!',
    subheadline: 'La Aspiradora Robot Jessica limpia sola mientras vos hacés lo que te gusta — con pago contra entrega.',
    cta: 'Quiero mi Robot',
    benefits: [
      'Limpia mientras dormís o trabajás',
      'Ideal para casas con mascotas',
      'Pagás solo cuando la recibís',
      'Envío gratis a todo el país',
      '30 días de garantía',
    ],
    urgency: '⚡ Solo quedan 12 unidades disponibles hoy',
    socialProof: { count: 328, label: 'compradores felices este mes' },
    colors: { primary: '#E6007E', accent: '#F3E9DF' },
  },
  qualification: {
    greeting: '¡Hola! 👋 Soy la asistente virtual de Yani Trend. ¿Te interesa la Aspiradora Robot? Contame un poco más para ayudarte mejor.',
    systemPrompt: `Sos una asistente de ventas inteligente de Yani Trend, una tienda online argentina.
Producto principal: Aspiradora Robot Jessica — $38,630 ARS, pago contra entrega, envío gratis.
Tu misión: calificar al lead, entender su necesidad y guiarlo hacia la compra.
Hacé preguntas naturales para descubrir:
- ¿Para qué ambiente/casa la necesita?
- ¿Tiene mascotas?
- ¿Qué le frena para comprar hoy?
- ¿Cuándo querría recibirla?
Después de 2-3 mensajes, pedí su nombre y WhatsApp para coordinár el envío.
Siempre respondé en español rioplatense (vos/te), con emojis amigables, respuestas cortas (máximo 3 líneas).
Si el cliente muestra interés alto, ofrecé el cupón BIENVENIDA10 para 10% de descuento.`,
    minScoreForHot: 70,
  },
  followUp: {
    immediateMessage: '¡Hola {name}! 🤖 Gracias por tu interés en la Aspiradora Robot Jessica. Te mando más info por acá 👇',
    dayOneMessage: '¡Hola {name}! ¿Pudiste pensar en la Aspiradora Robot? Hoy tenemos envío express disponible 🚀',
    dayThreeMessage: '{name}, último aviso — quedan pocas unidades de la Robot Jessica 😱 ¿La reservamos?',
    enabled: true,
  },
  createdAt: daysAgo(30),
};

class FunnelStore {
  private leads = new Map<string, Lead>(DEMO_LEADS.map(l => [l.id, l]));
  private configs = new Map<string, BusinessConfig>([[DEMO_CONFIG.id, DEMO_CONFIG]]);

  // Leads
  getLeads(businessId?: string): Lead[] {
    const all = Array.from(this.leads.values());
    return businessId ? all.filter(l => l.businessId === businessId) : all;
  }

  getLead(id: string): Lead | undefined {
    return this.leads.get(id);
  }

  createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const lead: Lead = {
      ...data,
      id: 'lead_' + uid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.set(lead.id, lead);
    return lead;
  }

  updateLead(id: string, patch: Partial<Lead>): Lead | null {
    const lead = this.leads.get(id);
    if (!lead) return null;
    const updated = { ...lead, ...patch, updatedAt: new Date().toISOString() };
    this.leads.set(id, updated);
    return updated;
  }

  // Configs
  getConfig(id: string): BusinessConfig | undefined {
    return this.configs.get(id);
  }

  getAllConfigs(): BusinessConfig[] {
    return Array.from(this.configs.values());
  }

  upsertConfig(config: BusinessConfig): BusinessConfig {
    this.configs.set(config.id, config);
    return config;
  }

  getStats(businessId: string) {
    const leads = this.getLeads(businessId);
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const config = this.configs.get(businessId);

    const byStatus = {} as Record<LeadStatus, number>;
    const byStage = {} as Record<FunnelStage, number>;
    let totalScore = 0;
    let hotLeads = 0;
    let todayLeads = 0;
    let weekLeads = 0;
    let converted = 0;

    for (const l of leads) {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
      byStage[l.stage] = (byStage[l.stage] || 0) + 1;
      totalScore += l.score;
      if (l.status === 'hot' || l.score >= 75) hotLeads++;
      if (new Date(l.createdAt).toDateString() === today) todayLeads++;
      if (new Date(l.createdAt) >= weekAgo) weekLeads++;
      if (l.status === 'converted') converted++;
    }

    const revenueEstimated = converted * (config?.price ?? 0);

    return {
      businessId,
      totalLeads: leads.length,
      byStatus,
      byStage,
      averageScore: leads.length ? Math.round(totalScore / leads.length) : 0,
      conversionRate: leads.length ? Math.round((converted / leads.length) * 100) : 0,
      hotLeads,
      todayLeads,
      weekLeads,
      revenueEstimated,
    };
  }
}

// Singleton — persists across requests within the same Node.js process
const globalStore = globalThis as typeof globalThis & { __funnelStore?: FunnelStore };
if (!globalStore.__funnelStore) globalStore.__funnelStore = new FunnelStore();
export const store = globalStore.__funnelStore;
