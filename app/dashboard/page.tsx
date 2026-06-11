'use client';

import { useState, useEffect, useCallback } from 'react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  score: number;
  stage: string;
  tags: string[];
  utm: { source?: string; medium?: string; campaign?: string };
  qualification: { painPoints?: string[]; interests?: string[]; objections?: string[]; readyToBuy?: boolean };
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalLeads: number;
  byStatus: Record<string, number>;
  byStage: Record<string, number>;
  averageScore: number;
  conversionRate: number;
  hotLeads: number;
  todayLeads: number;
  weekLeads: number;
  revenueEstimated: number;
}

const STATUS_COLOR: Record<string, string> = {
  new: '#6B7280',
  chatting: '#3B82F6',
  qualified: '#8B5CF6',
  interested: '#F59E0B',
  hot: '#EF4444',
  converted: '#10B981',
  lost: '#374151',
};

const STATUS_LABEL: Record<string, string> = {
  new: 'Nuevo',
  chatting: 'Chateando',
  qualified: 'Calificado',
  interested: 'Interesado',
  hot: '🔥 Caliente',
  converted: '✅ Convertido',
  lost: 'Perdido',
};

const STAGE_LABEL: Record<string, string> = {
  awareness: 'Conocimiento',
  interest: 'Interés',
  consideration: 'Consideración',
  intent: 'Intención',
  purchase: 'Compra',
  retention: 'Retención',
};

function fmt(n: number) {
  return n.toLocaleString('es-AR');
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'leads' | 'funnel'>('overview');

  const load = useCallback(async () => {
    setLoading(true);
    const [statsRes, leadsRes] = await Promise.all([
      fetch('/api/funnel/stats?businessId=yani-trend'),
      fetch('/api/funnel/leads?businessId=yani-trend'),
    ]);
    const { stats } = await statsRes.json();
    const { leads } = await leadsRes.json();
    setStats(stats);
    setLeads(leads.sort((a: Lead, b: Lead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredLeads = selectedStatus === 'all' ? leads : leads.filter(l => l.status === selectedStatus);

  const funnelStages = ['awareness', 'interest', 'consideration', 'intent', 'purchase'];
  const maxStageCount = stats ? Math.max(...funnelStages.map(s => stats.byStage[s] || 0), 1) : 1;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F0F1A', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ color: '#E6007E', fontSize: 18, fontWeight: 600 }}>Cargando dashboard... 🔄</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F1A', fontFamily: "'Poppins', sans-serif", color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1A1A2E; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .card { background: #1A1A2E; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,.06); }
        .metric-card { background: #1A1A2E; border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,.06); }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 500; padding: 8px 20px; border-radius: 8px; transition: all .2s; color: #aaa; }
        .tab-btn.active { background: rgba(230,0,126,.15); color: #E6007E; }
        .tab-btn:hover:not(.active) { background: rgba(255,255,255,.05); color: white; }
        .status-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .lead-row { padding: 14px 16px; border-radius: 10px; cursor: pointer; transition: background .15s; display: grid; align-items: center; gap: 12px; }
        .lead-row:hover { background: rgba(255,255,255,.04); }
        .score-bar { height: 4px; border-radius: 2px; }
        .filter-chip { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: #ccc; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all .15s; font-family: inherit; }
        .filter-chip.active { background: rgba(230,0,126,.2); border-color: #E6007E; color: #E6007E; }
        .refresh-btn { background: rgba(230,0,126,.15); border: 1px solid rgba(230,0,126,.3); color: #E6007E; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; }
        .refresh-btn:hover { background: rgba(230,0,126,.25); }
        .wa-btn { display: inline-flex; align-items: center; gap: 6px; background: #25D366; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
      `}</style>

      {/* Sidebar + Main */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: '#0A0A14', borderRight: '1px solid rgba(255,255,255,.06)', padding: '24px 16px', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#E6007E', marginBottom: 32 }}>
            🤖 YaniCRM
          </div>
          {[
            { key: 'overview', label: '📊 Overview', emoji: '' },
            { key: 'leads', label: '👥 Leads', emoji: '' },
            { key: 'funnel', label: '🔽 Embudo', emoji: '' },
          ].map(item => (
            <button
              key={item.key}
              className={`tab-btn ${tab === item.key ? 'active' : ''}`}
              onClick={() => setTab(item.key as typeof tab)}
              style={{ width: '100%', textAlign: 'left', marginBottom: 4 }}
            >
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 40 }}>
            <a href="/funnel" style={{ display: 'block', background: '#E6007E', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', marginBottom: 8 }}>
              Ver Embudo →
            </a>
            <a href="/" style={{ display: 'block', color: '#666', textAlign: 'center', padding: '8px', borderRadius: 8, fontSize: 12, textDecoration: 'none' }}>
              ← Tienda
            </a>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard de Ventas</h1>
              <p style={{ color: '#666', fontSize: 13, marginTop: 2 }}>Yani Trend · Embudo Inteligente</p>
            </div>
            <button className="refresh-btn" onClick={load}>🔄 Actualizar</button>
          </div>

          <div style={{ padding: '24px 32px' }}>
            {/* OVERVIEW TAB */}
            {tab === 'overview' && stats && (
              <>
                {/* KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'Total Leads', value: stats.totalLeads, icon: '👥', color: '#6366F1' },
                    { label: 'Leads Hoy', value: stats.todayLeads, icon: '📅', color: '#3B82F6' },
                    { label: 'Esta Semana', value: stats.weekLeads, icon: '📈', color: '#8B5CF6' },
                    { label: '🔥 Calientes', value: stats.hotLeads, icon: '🔥', color: '#EF4444' },
                    { label: 'Score Promedio', value: stats.averageScore + '%', icon: '⭐', color: '#F59E0B' },
                    { label: 'Conversión', value: stats.conversionRate + '%', icon: '✅', color: '#10B981' },
                  ].map((kpi, i) => (
                    <div key={i} className="metric-card">
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{kpi.label}</div>
                    </div>
                  ))}
                </div>

                {/* Revenue */}
                <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #1A0A1E 0%, #1A1A2E 100%)', border: '1px solid rgba(230,0,126,.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>💰 Ingresos Estimados (convertidos)</div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: '#E6007E' }}>$ {fmt(stats.revenueEstimated)}</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>ARS · {stats.byStatus['converted'] || 0} pedidos confirmados</div>
                    </div>
                    <div style={{ fontSize: 60 }}>💸</div>
                  </div>
                </div>

                {/* Status breakdown */}
                <div className="card" style={{ marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Estado de Leads</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {Object.entries(STATUS_LABEL).map(([status, label]) => {
                      const count = stats.byStatus[status] || 0;
                      const pct = stats.totalLeads ? (count / stats.totalLeads) * 100 : 0;
                      return (
                        <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 100, fontSize: 13, color: '#ccc' }}>{label}</div>
                          <div style={{ flex: 1, height: 8, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLOR[status], borderRadius: 4, transition: 'width 1s ease' }} />
                          </div>
                          <div style={{ width: 32, textAlign: 'right', fontSize: 14, fontWeight: 600 }}>{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent leads preview */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>Últimos Leads</h3>
                    <button className="tab-btn active" onClick={() => setTab('leads')} style={{ fontSize: 12 }}>Ver todos →</button>
                  </div>
                  {leads.slice(0, 5).map(lead => (
                    <div key={lead.id} onClick={() => { setSelectedLead(lead); setTab('leads'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: STATUS_COLOR[lead.status] + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: STATUS_COLOR[lead.status] }}>
                        {lead.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{lead.name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{lead.phone}</div>
                      </div>
                      <span className="status-chip" style={{ background: STATUS_COLOR[lead.status] + '22', color: STATUS_COLOR[lead.status] }}>
                        {STATUS_LABEL[lead.status]}
                      </span>
                      <div style={{ fontSize: 13, fontWeight: 700, color: lead.score >= 70 ? '#10B981' : lead.score >= 40 ? '#F59E0B' : '#888' }}>
                        {lead.score}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* LEADS TAB */}
            {tab === 'leads' && (
              <>
                {/* Filters */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                  <button className={`filter-chip ${selectedStatus === 'all' ? 'active' : ''}`} onClick={() => setSelectedStatus('all')}>
                    Todos ({leads.length})
                  </button>
                  {Object.entries(STATUS_LABEL).map(([status, label]) => {
                    const count = leads.filter(l => l.status === status).length;
                    if (!count) return null;
                    return (
                      <button key={status} className={`filter-chip ${selectedStatus === status ? 'active' : ''}`} onClick={() => setSelectedStatus(status)}>
                        {label} ({count})
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: selectedLead ? '1fr 360px' : '1fr', gap: 16 }}>
                  {/* Lead list */}
                  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 100px', gap: 12, fontSize: 11, color: '#666', fontWeight: 600, textTransform: 'uppercase' }}>
                      <span>Lead</span><span>Estado</span><span>Score</span><span>Etapa</span><span>Fuente</span>
                    </div>
                    {filteredLeads.map(lead => (
                      <div key={lead.id} className="lead-row"
                        onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                        style={{
                          gridTemplateColumns: '1fr 100px 80px 80px 100px',
                          background: selectedLead?.id === lead.id ? 'rgba(230,0,126,.08)' : undefined,
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: STATUS_COLOR[lead.status] + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: STATUS_COLOR[lead.status], fontSize: 13, flexShrink: 0 }}>
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{lead.name}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{lead.phone}</div>
                          </div>
                        </div>
                        <span className="status-chip" style={{ background: STATUS_COLOR[lead.status] + '22', color: STATUS_COLOR[lead.status] }}>
                          {STATUS_LABEL[lead.status]}
                        </span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: lead.score >= 70 ? '#10B981' : lead.score >= 40 ? '#F59E0B' : '#888' }}>{lead.score}</div>
                          <div className="score-bar" style={{ width: 50, background: '#222', marginTop: 4 }}>
                            <div className="score-bar" style={{ width: `${lead.score}%`, background: lead.score >= 70 ? '#10B981' : lead.score >= 40 ? '#F59E0B' : '#888' }} />
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>{STAGE_LABEL[lead.stage] || lead.stage}</div>
                        <div style={{ fontSize: 11, color: '#666' }}>{lead.utm?.source || 'Directo'}</div>
                      </div>
                    ))}
                    {filteredLeads.length === 0 && (
                      <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>No hay leads con este filtro</div>
                    )}
                  </div>

                  {/* Lead detail panel */}
                  {selectedLead && (
                    <div className="card" style={{ position: 'sticky', top: 0, maxHeight: '80vh', overflowY: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 15 }}>Detalle</h3>
                        <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18 }}>×</button>
                      </div>

                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: STATUS_COLOR[selectedLead.status] + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: STATUS_COLOR[selectedLead.status], margin: '0 auto 16px' }}>
                        {selectedLead.name.charAt(0)}
                      </div>
                      <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ fontWeight: 700, fontSize: 17 }}>{selectedLead.name}</div>
                        <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{selectedLead.phone}</div>
                        <div style={{ marginTop: 10 }}>
                          <span className="status-chip" style={{ background: STATUS_COLOR[selectedLead.status] + '22', color: STATUS_COLOR[selectedLead.status], fontSize: 13, padding: '5px 14px' }}>
                            {STATUS_LABEL[selectedLead.status]}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div style={{ background: '#0F0F1A', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: '#888' }}>Score de intención</span>
                          <span style={{ fontWeight: 700, color: selectedLead.score >= 70 ? '#10B981' : '#F59E0B' }}>{selectedLead.score}/100</span>
                        </div>
                        <div style={{ height: 8, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${selectedLead.score}%`, background: selectedLead.score >= 70 ? '#10B981' : selectedLead.score >= 40 ? '#F59E0B' : '#888', borderRadius: 4 }} />
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                        {[
                          { label: 'Etapa', value: STAGE_LABEL[selectedLead.stage] || selectedLead.stage },
                          { label: 'Fuente', value: selectedLead.utm?.source || 'Directo' },
                          { label: 'Campaña', value: selectedLead.utm?.campaign || '—' },
                          { label: 'Creado', value: new Date(selectedLead.createdAt).toLocaleDateString('es-AR') },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>{label}</span>
                            <span style={{ color: '#ccc', fontWeight: 500 }}>{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pain points */}
                      {(selectedLead.qualification.painPoints?.length ?? 0) > 0 && (
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginBottom: 6 }}>NECESIDADES</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {selectedLead.qualification.painPoints!.map((p, i) => (
                              <span key={i} style={{ background: '#1E3A5F', color: '#60A5FA', borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {selectedLead.tags.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginBottom: 6 }}>ETIQUETAS</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {selectedLead.tags.map(t => (
                              <span key={t} style={{ background: 'rgba(230,0,126,.15)', color: '#E6007E', borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <a className="wa-btn" href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          💬 Escribir por WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* FUNNEL TAB */}
            {tab === 'funnel' && stats && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Visualización del Embudo</h2>
                <p style={{ color: '#666', fontSize: 13, marginBottom: 28 }}>Cuántos leads hay en cada etapa del proceso de venta</p>

                <div className="card" style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                    {funnelStages.map((stage, i) => {
                      const count = stats.byStage[stage] || 0;
                      const pct = Math.max((count / maxStageCount) * 100, 4);
                      const colors = ['#6366F1', '#8B5CF6', '#A855F7', '#EF4444', '#10B981'];
                      const width = 100 - i * 10;
                      return (
                        <div key={stage} style={{ width: `${width}%`, display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ flex: 1, background: colors[i], borderRadius: 8, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all .5s' }}>
                            <span style={{ fontWeight: 700, fontSize: 15 }}>{count}</span>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{STAGE_LABEL[stage]}</span>
                          </div>
                          <div style={{ width: 60, fontSize: 12, color: '#666', textAlign: 'right' }}>
                            {i > 0 && stats.byStage[funnelStages[i - 1]] ? Math.round((count / (stats.byStage[funnelStages[i - 1]] || 1)) * 100) + '%' : '100%'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Source breakdown */}
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Fuentes de Tráfico</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(() => {
                      const sources: Record<string, number> = {};
                      leads.forEach(l => { const s = l.utm?.source || 'Directo'; sources[s] = (sources[s] || 0) + 1; });
                      const total = leads.length || 1;
                      return Object.entries(sources).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                        <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 90, fontSize: 13, color: '#ccc', textTransform: 'capitalize' }}>{source}</div>
                          <div style={{ flex: 1, height: 8, background: '#222', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(count / total) * 100}%`, background: '#E6007E', borderRadius: 4 }} />
                          </div>
                          <div style={{ width: 60, fontSize: 13, textAlign: 'right', color: '#ccc' }}>{count} ({Math.round((count / total) * 100)}%)</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
