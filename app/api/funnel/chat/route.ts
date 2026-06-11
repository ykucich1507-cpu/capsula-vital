import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/funnel/store';
import { chatWithAI, buildWhatsAppUrl } from '@/lib/funnel/ai';
import { ChatMessage, FunnelStage, LeadStatus } from '@/lib/funnel/types';

function scoreToStage(score: number): FunnelStage {
  if (score < 20) return 'awareness';
  if (score < 40) return 'interest';
  if (score < 60) return 'consideration';
  if (score < 80) return 'intent';
  return 'purchase';
}

function scoreToStatus(score: number, hasContact: boolean): LeadStatus {
  if (hasContact && score >= 80) return 'converted';
  if (score >= 75) return 'hot';
  if (score >= 55) return 'interested';
  if (score >= 30) return 'qualified';
  return 'chatting';
}

export async function POST(req: NextRequest) {
  try {
    const { leadId, businessId, message, chatHistory } = await req.json();

    const config = store.getConfig(businessId);
    if (!config) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    let lead = leadId ? store.getLead(leadId) : null;
    const currentScore = lead?.score ?? 10;

    const aiResult = await chatWithAI(config, chatHistory ?? [], message, currentScore);

    const newScore = Math.min(100, Math.max(0, currentScore + aiResult.scoreBoost));
    const newMsg: ChatMessage = { role: 'user', content: message, timestamp: new Date().toISOString() };
    const replyMsg: ChatMessage = { role: 'assistant', content: aiResult.reply, timestamp: new Date().toISOString() };

    const updatedHistory = [...(lead?.chatHistory ?? chatHistory ?? []), newMsg, replyMsg];
    const hasContact = !!(aiResult.extractedPhone || lead?.phone);

    if (!lead && aiResult.extractedPhone) {
      lead = store.createLead({
        businessId,
        name: aiResult.extractedName || 'Nuevo lead',
        phone: aiResult.extractedPhone,
        status: scoreToStatus(newScore, true),
        score: newScore,
        stage: scoreToStage(newScore),
        tags: ['funnel', 'chatbot'],
        chatHistory: updatedHistory,
        customFields: {},
        utm: {},
        qualification: { painPoints: [], interests: [], objections: [], ...aiResult.qualificationUpdate },
      });
    } else if (lead) {
      const name = aiResult.extractedName && lead.name === 'Sin nombre' ? aiResult.extractedName : lead.name;
      const phone = aiResult.extractedPhone || lead.phone;
      lead = store.updateLead(lead.id, {
        name,
        phone,
        score: newScore,
        stage: scoreToStage(newScore),
        status: scoreToStatus(newScore, hasContact),
        chatHistory: updatedHistory,
        qualification: {
          ...lead.qualification,
          ...aiResult.qualificationUpdate,
          painPoints: [...(lead.qualification.painPoints || []), ...(aiResult.qualificationUpdate.painPoints || [])],
          interests: [...(lead.qualification.interests || []), ...(aiResult.qualificationUpdate.interests || [])],
          objections: [...(lead.qualification.objections || []), ...(aiResult.qualificationUpdate.objections || [])],
        },
      }) ?? lead;
    }

    let whatsappUrl: string | undefined;
    if (aiResult.action === 'close' && config.whatsappNumber && lead) {
      const followupMsg = config.followUp.immediateMessage.replace('{name}', lead.name);
      whatsappUrl = buildWhatsAppUrl(config.whatsappNumber, followupMsg);
    }

    return NextResponse.json({
      reply: aiResult.reply,
      leadId: lead?.id,
      score: newScore,
      action: aiResult.action,
      whatsappUrl,
      capturedName: aiResult.extractedName,
      capturedPhone: aiResult.extractedPhone,
    });
  } catch (e) {
    console.error('Chat error:', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
