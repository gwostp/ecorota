/**
 * Mensagem de coleta enviada quinta/sábado (caminhão na rua).
 */
export function buildColetaMessage(nome: string): string {
  const firstName = nome.trim().split(/\s+/)[0] || 'morador'
  return `Olá, ${firstName}! Hoje o caminhão de coleta passará na sua rua. Separe seu lixo corretamente e contribua com o meio ambiente. ♻️`
}
