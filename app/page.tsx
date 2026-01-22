"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  Users,
  ArrowRight,
  DollarSign,
  ShoppingCart,
  Activity,
  CheckCircle2,
  AlertCircle,
  Calendar
} from "lucide-react"

// --- UTILS ---

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value)
}

export default function FollowerPotentialCalculator() {
  const [step, setStep] = useState(0)
  const [followers, setFollowers] = useState<number | "">("")
  const [recoveryRate, setRecoveryRate] = useState<10 | 15 | 20>(15)

  // --- LÓGICA DE URL E INICIALIZAÇÃO ---
  useEffect(() => {
    // Verifica se existe o param ?f=12345 na URL ao carregar
    const params = new URLSearchParams(window.location.search)
    const fParam = params.get('f')
    if (fParam && !isNaN(Number(fParam))) {
      setFollowers(Number(fParam))
      setStep(1)
    }
  }, [])

  const handleNext = () => {
    if (Number(followers) > 0) {
      // Atualiza a URL sem recarregar a página para criar o link compartilhável
      const newUrl = `${window.location.pathname}?f=${followers}`
      window.history.pushState({ path: newUrl }, '', newUrl)
      setStep(1)
    }
  }

  // --- CÁLCULOS MATEMÁTICOS ---
  
  const f = Number(followers) || 0

  // 1. Funil Mid Ticket
  const midSales = f * 0.0065 // 0.65% de vendas
  const midRevenue = midSales * 200 // Ticket R$ 200
  const midAdsCost = (200 * 0.30) * midSales // 30% do ticket * vendas
  const midAbandons = midSales * 0.70 // 70% das vendas = abandonos
  const midTableMoney = midAbandons * 200 // Dinheiro na mesa (Abandonos * Ticket)
  const midRecovered = midTableMoney * (recoveryRate / 100)

  // 2. Funil Low Ticket
  const lowSales = f * 0.01 // 1% de vendas
  const lowRevenue = lowSales * 70 // Ticket R$ 70
  const lowAdsCost = (70 * 0.30) * lowSales // 30% do ticket * vendas
  const lowAbandons = lowSales * 1.30 // 130% das vendas = abandonos
  const lowTableMoney = lowAbandons * 70 // Dinheiro na mesa (Abandonos * Ticket)
  const lowRecovered = lowTableMoney * (recoveryRate / 100)

  // Animação dos slides
  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  }

  return (
    <div className="min-h-screen bg-[#0a0f0b] text-white font-sans overflow-x-hidden selection:bg-[#7cba10] selection:text-[#0a0f0b] pb-10">
      {/* Background Effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#7cba10] opacity-[0.08] blur-[128px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00ffc8] opacity-[0.05] blur-[128px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        
        {/* Header Compacto */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7cba10] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,186,16,0.3)]">
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-white">Simulador de Escala</span>
          </div>
          {step === 1 && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setStep(0)
                window.history.pushState({}, '', window.location.pathname)
              }}
              className="text-white/50 hover:text-[#7cba10] h-8 text-xs"
            >
              Nova Simulação
            </Button>
          )}
        </header>

        <AnimatePresence mode="wait">
          
          {/* ETAPA 0: INPUT DE SEGUIDORES */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                  Descubra o Potencial Oculto da sua <span className="text-[#7cba10] inline-block">Audiência</span>
                </h1>
                <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                  Insira o tamanho da sua base e nós projetaremos dois cenários de faturamento e o dinheiro que você está deixando na mesa hoje.
                </p>

                <div className="bg-[#142415] border border-[#1e3a1f] p-2 rounded-2xl flex items-center gap-2 shadow-2xl shadow-[#7cba10]/10 max-w-md mx-auto group focus-within:border-[#7cba10] transition-colors">
                  <div className="pl-4 text-white/40 group-focus-within:text-[#7cba10] transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <Input
                    type="number"
                    placeholder="Qtd. Seguidores (ex: 50000)"
                    className="border-none bg-transparent text-xl h-14 text-white placeholder:text-white/20 focus-visible:ring-0 shadow-none font-medium"
                    value={followers}
                    onChange={(e) => setFollowers(Number(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    autoFocus
                  />
                  <Button
                    onClick={handleNext}
                    className="h-12 px-8 rounded-xl bg-[#7cba10] hover:bg-[#6aa80e] text-black font-bold text-base transition-all hover:scale-105 shadow-[0_0_20px_rgba(124,186,16,0.3)]"
                    disabled={!followers}
                  >
                    Simular
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ETAPA 1: DASHBOARD DE RESULTADOS */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="mb-6 text-center md:text-left">
                 <h2 className="text-3xl font-bold text-white tracking-tight">
                   Resultados para <span className="text-[#7cba10] border-b-2 border-[#7cba10]/30">{formatNumber(f)} seguidores</span>
                 </h2>
                 <p className="text-white/50 text-sm mt-2">Análise comparativa de performance e desperdício financeiro.</p>
              </div>

              {/* GRID DOS 2 CENÁRIOS */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                
                {/* CARD LOW TICKET */}
                <ScenarioCard 
                  title="Funil Low Ticket"
                  ticket="R$ 70,00"
                  badgeColor="bg-blue-500/10 text-blue-400 border-blue-500/20"
                  icon={<Activity className="w-5 h-5 text-blue-400" />}
                  metrics={{
                    sales: lowSales,
                    revenue: lowRevenue,
                    ads: lowAdsCost,
                    abandons: lowAbandons,
                    tableMoney: lowTableMoney
                  }}
                />

                {/* CARD MID TICKET */}
                <ScenarioCard 
                  title="Funil Mid Ticket"
                  ticket="R$ 200,00"
                  badgeColor="bg-[#7cba10]/10 text-[#7cba10] border-[#7cba10]/20"
                  icon={<CheckCircle2 className="w-5 h-5 text-[#7cba10]" />}
                  metrics={{
                    sales: midSales,
                    revenue: midRevenue,
                    ads: midAdsCost,
                    abandons: midAbandons,
                    tableMoney: midTableMoney
                  }}
                />

              </div>

              {/* SEÇÃO DA RECUPERAÇÃO */}
              <div className="bg-[#0f1a12] border border-[#7cba10]/30 rounded-2xl p-5 md:p-8 relative overflow-hidden shadow-2xl">
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-[#7cba10]" />
                        O Poder da Recuperação
                      </h3>
                      <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
                        Ajuste a taxa de conversão abaixo para ver quanto dinheiro extra entraria no seu caixa 
                        apenas convertendo quem já demonstrou interesse, <span className="text-white font-bold border-b border-white/20">sem gastar 1 real a mais em anúncios.</span>
                      </p>
                    </div>

                    {/* SELETOR */}
                    <div className="bg-[#0a0f0b] p-1.5 rounded-xl border border-[#1e3a1f] flex items-center shrink-0">
                      {[10, 15, 20].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setRecoveryRate(rate as any)}
                          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                            recoveryRate === rate
                              ? "bg-[#7cba10] text-[#0a0f0b] shadow-lg shadow-[#7cba10]/20 scale-105"
                              : "text-white/40 hover:text-white hover:bg-[#1e3a1f]"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RESULTADOS DA RECUPERAÇÃO */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <RecoveryResult 
                      label="No Cenário Low Ticket" 
                      value={lowRecovered} 
                      rate={recoveryRate}
                    />
                    <RecoveryResult 
                      label="No Cenário Mid Ticket" 
                      value={midRecovered} 
                      rate={recoveryRate}
                    />
                  </div>
                </div>
              </div>

              {/* BOTÃO CTA PULSANTE & DISCLAIMER */}
              <div className="mt-8 text-center space-y-6">
                <a 
                  href="https://app.cal.com/recupera.ia/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button 
                    size="lg" 
                    className="bg-white text-black hover:bg-gray-100 font-bold px-8 py-7 text-lg rounded-full animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Conversa com Sócio
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>

                <p className="text-[10px] text-white/20 max-w-xl mx-auto uppercase tracking-widest font-mono">
                  * Os números apresentados são estimativas baseadas na média de performance dos nossos clientes. Resultados reais podem variar de acordo com nicho e engajamento.
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTES OTIMIZADOS ---

function ScenarioCard({ 
  title, 
  ticket, 
  badgeColor, 
  icon,
  metrics 
}: { 
  title: string, 
  ticket: string, 
  badgeColor: string, 
  icon: React.ReactNode,
  metrics: { sales: number, revenue: number, ads: number, abandons: number, tableMoney: number }
}) {
  return (
    <Card className="bg-[#0d140e]/90 backdrop-blur-sm border border-[#1e3a1f] p-5 rounded-2xl hover:border-[#7cba10]/30 transition-colors duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1e3a1f]">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${badgeColor.split(' ')[2]} ${badgeColor.split(' ')[0]} bg-opacity-10`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-xl text-white tracking-tight">{title}</h3>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
              Ticket: {ticket}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-grow">
        <MetricRow label="Vendas Mensais" value={Math.floor(metrics.sales)} isCurrency={false} />
        <MetricRow label="Faturamento Mensal" value={metrics.revenue} isCurrency={true} highlight color="text-[#00ffc8]" />
        <MetricRow label="Custo de Tráfego" value={metrics.ads} isCurrency={true} subtext="(Mensal)" />
        
        <div className="my-5 border-t border-dashed border-[#1e3a1f]" />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-white/60 flex items-center gap-1.5 font-medium">
              <ShoppingCart className="w-4 h-4" /> Abandonos Mensais
            </span>
            <span className="text-white font-mono text-lg font-bold">{Math.floor(metrics.abandons)}</span>
          </div>
          
          <div className="bg-[#ff3b5c]/10 border border-[#ff3b5c]/20 p-4 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#ff3b5c]/5 group-hover:bg-[#ff3b5c]/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1 text-[#ff3b5c]">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Dinheiro na Mesa</span>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight">
                {formatCurrency(metrics.tableMoney)}
              </p>
              <p className="text-[10px] text-white/40 mt-1 font-medium">
                Faturamento perdido em checkouts abandonados
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function MetricRow({ label, value, isCurrency, highlight, subtext, color = "text-white" }: { label: string, value: number, isCurrency: boolean, highlight?: boolean, subtext?: string, color?: string }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-white/60 text-sm font-medium">{label} {subtext && <span className="text-[10px] opacity-70 font-normal">{subtext}</span>}</span>
      <span className={`font-mono font-medium ${highlight ? `text-xl ${color}` : 'text-lg text-white'}`}>
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </span>
    </div>
  )
}

function RecoveryResult({ label, value, rate }: { label: string, value: number, rate: number }) {
  return (
    <div className="bg-[#0a0f0b] border border-[#1e3a1f] p-5 rounded-xl flex flex-col justify-between h-full hover:border-[#7cba10]/50 transition-colors group">
      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest mb-3">{label}</span>
      <div>
        <div className="text-[10px] text-[#7cba10] mb-1 font-mono font-bold uppercase">Recuperando {rate}%:</div>
        <div className="text-3xl md:text-4xl font-bold text-white gradient-text group-hover:scale-[1.02] transition-transform origin-left">
          +{formatCurrency(value)}
        </div>
        <p className="text-[10px] text-white/30 mt-2 font-medium">
          Receita adicional líquida estimada/mês
        </p>
      </div>
    </div>
  )
}
