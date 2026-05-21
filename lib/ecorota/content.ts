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
