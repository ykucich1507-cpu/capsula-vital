import { ChatMessage, BusinessConfig, LeadQualification } from './types';

interface AIResponse {
  reply: string;
  scoreBoost: number;
  qualificationUpdate: Partial<LeadQualification>;
  action?: 'capture_contact' | 'show_offer' | 'close';
  extractedName?: string;
  extractedPhone?: string;
}

const UNIVERSAL_SYSTEM_SUFFIX = `
REGLAS IMPORTANTES:
- Respondé SOLO con un JSON válido en este formato exacto:
{
  "reply": "tu respuesta en texto plano",
  "scoreBoost": número entre -10 y +20,
  "qualificationUpdate": {
    "painPoints": [],
    "interests": [],
    "objections": [],
    "budget": "",
    "timeline": "",
    "readyToBuy": false
  },
  "action": null,
  "extractedName": null,
  "extractedPhone": null
}
- Si el usuario da su nombre, ponélo en extractedName
- Si da un teléfono/WhatsApp, ponélo en extractedPhone
- Si ya tenés nombre y teléfono, poné action: "close"
- Si el usuario muestra mucho interés, ponés action: "show_offer"
- scoreBoost positivo = señal de compra, negativo = objeción fuerte
`;

export async function chatWithAI(
  config: BusinessConfig,
  chatHistory: ChatMessage[],
  userMessage: string,
  currentScore: number,
): Promise<AIResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return fallbackResponse(userMessage, currentScore, config);
  }

  const systemPrompt = config.qualification.systemPrompt + UNIVERSAL_SYSTEM_SUFFIX;

  const messages = [
    ...chatHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Anthropic API error:', err);
      return fallbackResponse(userMessage, currentScore, config);
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallbackResponse(userMessage, currentScore, config);

    const parsed = JSON.parse(jsonMatch[0]) as AIResponse;
    return parsed;
  } catch (e) {
    console.error('AI chat error:', e);
    return fallbackResponse(userMessage, currentScore, config);
  }
}

function fallbackResponse(msg: string, score: number, config: BusinessConfig): AIResponse {
  const lower = msg.toLowerCase();
  const buySignals = ['sí', 'si', 'quiero', 'comprar', 'pedir', 'precio', 'envío', 'cuánto', 'cuanto', 'interesa', 'me gusta'];
  const objections = ['caro', 'no tengo', 'no puedo', 'no me interesa', 'no gracias'];

  const hasBuySignal = buySignals.some(w => lower.includes(w));
  const hasObjection = objections.some(w => lower.includes(w));
  const scoreBoost = hasBuySignal ? 10 : hasObjection ? -5 : 2;

  const phoneMatch = msg.match(/(\+?[\d\s\-]{8,15})/);
  const extractedPhone = phoneMatch ? phoneMatch[1].trim() : undefined;
  const nameMatch = msg.match(/(?:soy|me llamo|mi nombre es)\s+([A-ZÁÉÍÓÚa-záéíóú]+)/i);
  const extractedName = nameMatch ? nameMatch[1] : undefined;

  const replies = [
    `¡Gracias por escribir! 😊 ${config.product} es ideal para vos. ¿Querés que te cuente más sobre cómo funciona?`,
    `Perfecto. Para darte la mejor atención, ¿cómo es tu espacio? (departamento, casa, tamaño aproximado)`,
    `Entiendo. Para coordinar tu pedido, ¿me das tu nombre y WhatsApp? Así te mandamos toda la info 📱`,
  ];

  const replyIndex = score < 40 ? 0 : score < 65 ? 1 : 2;

  return {
    reply: replies[Math.min(replyIndex, replies.length - 1)],
    scoreBoost,
    qualificationUpdate: {
      painPoints: hasBuySignal ? ['interés en producto'] : [],
      interests: hasBuySignal ? [config.product] : [],
      objections: hasObjection ? ['precio / disponibilidad'] : [],
    },
    action: extractedPhone ? 'close' : hasBuySignal ? 'show_offer' : undefined,
    extractedName,
    extractedPhone,
  };
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}
