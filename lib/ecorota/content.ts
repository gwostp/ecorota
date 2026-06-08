export const SITE = {
  name: 'EcoRota',
  tagline: 'Coleta seletiva e reciclagem em Joinville',
  city: 'Joinville — SC',
} as const

export const PROJECT = {
  title: 'Sobre o projeto',
  paragraphs: [
    'O EcoRota é um sistema digital para apoiar a coleta seletiva e a reciclagem em Joinville. A plataforma conecta moradores, associações e cooperativas em um fluxo simples de cadastro, informação e acompanhamento.',
    'Nosso objetivo é aumentar o volume de materiais corretamente separados, reduzir o descarte irregular e fortalecer a economia circular na cidade, com transparência sobre dias e tipos de coleta.',
    'Cadastre-se para acessar seu painel, receber lembretes dos dias de coleta e registrar sua participação no programa municipal de reciclagem.',
  ],
  goals: [
    {
      title: 'Coleta seletiva',
      description:
        'Orientações claras sobre o que separar e como preparar os resíduos antes da coleta.',
    },
    {
      title: 'Reciclagem local',
      description:
        'Apoio à cadeia de reciclagem de Joinville, do descarte consciente à destinação correta.',
    },
    {
      title: 'Comunidade ativa',
      description:
        'Moradores engajados com metas ambientais e indicadores de impacto no painel.',
    },
  ],
} as const

export const COLLECTION_SCHEDULE = {
  title: 'Dias de coleta em Joinville',
  subtitle: 'Programação de referência para coleta seletiva — confirme no seu bairro.',
  days: [
    {
      day: 'Quinta-feira',
      short: 'Qui',
      icon: 'thursday' as const,
      focus: 'Orgânicos e recicláveis secos',
      time: 'Manhã — 7h às 12h',
      items: [
        'Restos de alimentos (orgânicos em saco próprio)',
        'Papel e papelão limpos e secos',
        'Plásticos, metais e vidros já lavados',
      ],
      tip: 'Deixe os materiais na calçada até 6h45. Evite sacos pretos para recicláveis.',
    },
    {
      day: 'Sábado',
      short: 'Sáb',
      icon: 'saturday' as const,
      focus: 'Recicláveis e embalagens',
      time: 'Manhã — 7h às 12h',
      items: [
        'Garrafas PET e embalagens plásticas',
        'Latas e metais leves',
        'Vidros e papelão (sem contaminação)',
      ],
      tip: 'Separe por tipo quando possível. Não misture reciclável com rejeito.',
    },
  ],
} as const

export const WASTE_TYPES = [
  { name: 'Papel / papelão', color: 'bg-amber-100 text-amber-900' },
  { name: 'Plástico', color: 'bg-sky-100 text-sky-900' },
  { name: 'Metal', color: 'bg-zinc-200 text-zinc-800' },
  { name: 'Vidro', color: 'bg-emerald-100 text-emerald-900' },
  { name: 'Orgânico', color: 'bg-lime-100 text-lime-900' },
  { name: 'Rejeito', color: 'bg-stone-200 text-stone-800' },
] as const

export const STEPS = [
  'Cadastre-se na plataforma com e-mail e senha.',
  'Separe os resíduos conforme as orientações de coleta seletiva.',
  'Consulte quinta e sábado no painel e prepare os materiais na véspera.',
  'Acompanhe sua participação e metas no painel do usuário.',
] as const

// ─── Mapeamento de bairros de Joinville por dia/horário de coleta ─────────────
// Fonte: COMCAP / Prefeitura de Joinville (referência ilustrativa)
// Em produção real, substituir por dados oficiais atualizados.

export type ColectaInfo = {
  days: string          // ex: "Quinta e sábado"
  time: string          // ex: "Manhã — 7h às 12h"
  note?: string         // dica específica do bairro
  truck?: {
    type: 'reciclavel' | 'organico' | 'misto'
    label: string       // ex: "Caminhão de recicláveis"
    color: string       // classe tailwind de cor
    items: string[]     // o que aceita
  }
}

// Tipos de caminhão reutilizáveis
const TRUCK_RECICLAVEL = {
  type: 'reciclavel' as const,
  label: 'Caminhão de recicláveis',
  color: 'text-blue-700 bg-blue-50 border-blue-200',
  items: ['Papel e papelão', 'Plásticos', 'Metais', 'Vidros'],
}
const TRUCK_ORGANICO = {
  type: 'organico' as const,
  label: 'Caminhão de orgânicos',
  color: 'text-amber-700 bg-amber-50 border-amber-200',
  items: ['Restos de alimentos', 'Cascas e folhas', 'Borra de café'],
}
const TRUCK_MISTO = {
  type: 'misto' as const,
  label: 'Caminhão misto (reciclável + orgânico)',
  color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  items: ['Recicláveis secos', 'Orgânicos (saco próprio)'],
}

export const BAIRRO_COLETA: Record<string, ColectaInfo> = {
  'Centro':              { days: 'Terça e sexta',   time: 'Manhã — 6h às 11h',    truck: TRUCK_RECICLAVEL },
  'Anita Garibaldi':     { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'América':             { days: 'Quarta e sábado',  time: 'Manhã — 7h às 12h',   truck: TRUCK_RECICLAVEL },
  'Atiradores':          { days: 'Terça e sexta',    time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Bom Retiro':          { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Bucarein':            { days: 'Terça e sexta',    time: 'Manhã — 6h30 às 11h', truck: TRUCK_RECICLAVEL },
  'Costa e Silva':       { days: 'Quarta e sábado',  time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Fátima':              { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Floresta':            { days: 'Terça e sexta',    time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Glória':              { days: 'Quarta e sábado',  time: 'Manhã — 7h às 12h',   truck: TRUCK_RECICLAVEL },
  'Iririú':              { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Itaum':               { days: 'Terça e sexta',    time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Jardim Iririú':       { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Jardim Sofia':        { days: 'Quarta e sábado',  time: 'Manhã — 7h às 12h',   truck: TRUCK_RECICLAVEL },
  'Paranaguamirim':      { days: 'Terça e sexta',    time: 'Tarde — 13h às 18h',  truck: TRUCK_ORGANICO },
  'Petrópolis':          { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Profipo':             { days: 'Quarta e sábado',  time: 'Manhã — 7h às 12h',   truck: TRUCK_RECICLAVEL },
  'Santo Antônio':       { days: 'Terça e sexta',    time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'São Marcos':          { days: 'Segunda e quinta', time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Saguaçu':             { days: 'Quarta e sábado',  time: 'Manhã — 7h às 12h',   truck: TRUCK_RECICLAVEL },
  'Vila Nova':           { days: 'Terça e sexta',    time: 'Manhã — 7h às 12h',   truck: TRUCK_MISTO },
  'Zona Industrial Norte': { days: 'Quinta', time: 'Manhã — 7h às 11h', note: 'Apenas área residencial', truck: TRUCK_RECICLAVEL },
}

// Fallback quando bairro não está mapeado
export const COLETA_PADRAO: ColectaInfo = {
  days: 'Quinta e sábado',
  time: 'Manhã — 7h às 12h',
  note: 'Confirme o horário exato com a COMCAP pelo site da Prefeitura de Joinville.',
}

export function getColectaByBairro(bairro: string): ColectaInfo {
  // Tenta match direto
  if (BAIRRO_COLETA[bairro]) return BAIRRO_COLETA[bairro]
  // Tenta match parcial (case-insensitive)
  const key = Object.keys(BAIRRO_COLETA).find(
    (k) => k.toLowerCase() === bairro.toLowerCase() ||
           bairro.toLowerCase().includes(k.toLowerCase())
  )
  return key ? BAIRRO_COLETA[key] : COLETA_PADRAO
}
