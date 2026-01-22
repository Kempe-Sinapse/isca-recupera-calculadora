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
  AlertTriangle,
  Calendar,
  Zap
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
    const params = new URLSearchParams(window.location.search)
    const fParam = params.get('f')
    if (fParam && !isNaN(Number(fParam))) {
      setFollowers(Number(fParam))
      setStep(1)
    }
  }, [])

  const handleNext = () => {
    if (Number(followers) > 0) {
      const newUrl = `${window.location.pathname}?f=${followers}`
      window.history.pushState({ path: newUrl }, '', newUrl)
      setStep(1)
    }
  }

  // --- CÁLCULOS MATEMÁTICOS ---
  
  const f = Number(followers) || 0

  // 1. Funil Mid Ticket
  const midSales = f * 0.0065 // 0.65%
  const midRevenue = midSales * 200 // Ticket 200
  const midAdsCost = (200 * 0.30) * midSales // 30% do ticket
  const midAbandons = midSales * 0.70 // 70% de abandono
  const midTableMoney = midAbandons * 200 // Dinheiro na mesa
  const midRecovered = midTableMoney * (recoveryRate / 100)

  // 2. Funil Low Ticket
  const lowSales = f * 0.01 // 1%
  const lowRevenue = lowSales * 70 // Ticket 70
  const lowAdsCost = (70 * 0.30) * lowSales // 30% do ticket
  // AJUSTE MATEMÁTICO: Alterado para 1.35 (135%) para diferenciar do resultado Mid Ticket visualmente
  const lowAbandons = lowSales * 1.35 
  const lowTableMoney = lowAbandons * 70 // Dinheiro na mesa
  const lowRecovered = lowTableMoney * (recoveryRate / 100)

  const slideVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#7cba10] selection:text-[#0a0f0b] pb-12">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7cba10] opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00ffc8] opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-[#ffffff] opacity-[0.02] blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6 relative z-10">
        
        {/* Header Ultra Minimalista */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#7cba10] to-[#5a8a0a] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,186,16,0.2)] border border-[#7cba10]/20">
              <TrendingUp className="text-[#050505] w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">Simulador de Escala</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Recupera.ia Intelligence</p>
            </div>
          </div>
          {step === 1 && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setStep(0)
                window.history.pushState({}, '', window.location.pathname)
              }}
              className="text-white/40 hover:text-[#7cba10] hover:bg-[#7cba10]/5 text-xs h-8 px-3 rounded-full transition-all"
            >
              Recalcular
            </Button>
          )}
        </header>

        <AnimatePresence mode="wait">
          
          {/* ETAPA 0: INPUT */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-3xl mx-auto"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#7cba10]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7cba10] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7cba10]"></span>
                  </span>
                  SISTEMA ONLINE
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                  Revelando seu <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7cba10] to-[#00ffc8]">Lucro Invisível</span>
                </h1>
                
                <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                  Digite sua audiência. Nossa IA projeta instantaneamente o dinheiro que você deixa na mesa todos os meses.
                </p>

                <div className="relative max-w-md mx-auto mt-8 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-[#0a0f0b] rounded-2xl flex items-center p-2 border border-white/10 group-focus-within:border-[#7cba10]/50 transition-colors">
                    <div className="pl-4 text-white/30 group-focus-within:text-[#7cba10] transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <Input
                      type="number"
                      placeholder="Ex: 50000 seguidores"
                      className="border-none bg-transparent text-2xl h-16 text-white placeholder:text-white/10 focus-visible:ring-0 shadow-none font-bold text-center tracking-tight"
                      value={followers}
                      onChange={(e) => setFollowers(Number(e.target.value))}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      autoFocus
                    />
                    <Button
                      onClick={handleNext}
                      className="h-14 px-8 rounded-xl bg-[#7cba10] hover:bg-[#63960d] text-[#050505] font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      disabled={!followers}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ETAPA 1: DASHBOARD COMPACTO */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/5 pb-6">
                 <div>
                   <h2 className="text-4xl font-bold text-white tracking-tighter">
                     Análise de <span className="text-[#7cba10]">{formatNumber(f)}</span> seguidores
                   </h2>
                   <p className="text-white/40 text-sm mt-1 font-medium">Potencial de faturamento vs. desperdício atual</p>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-mono text-white/30 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Activity className="w-3 h-3" />
                    <span>DADOS EM TEMPO REAL</span>
                 </div>
              </div>

              {/* GRID COMPARATIVO */}
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* LOW TICKET */}
                <ScenarioCard 
                  title="Funil Low Ticket"
                  ticket="R$ 70,00"
                  accentColor="blue"
                  icon={<Zap className="w-5 h-5 text-blue-400" fill="currentColor" />}
                  metrics={{
                    sales: lowSales,
                    revenue: lowRevenue,
                    ads: lowAdsCost,
                    abandons: lowAbandons,
                    tableMoney: lowTableMoney
                  }}
                />

                {/* MID TICKET */}
                <ScenarioCard 
                  title="Funil Mid Ticket"
                  ticket="R$ 200,00"
                  accentColor="green"
                  icon={<CheckCircle2 className="w-5 h-5 text-[#7cba10]" fill="currentColor" className="text-[#0a0f0b]" />}
                  metrics={{
                    sales: midSales,
                    revenue: midRevenue,
                    ads: midAdsCost,
                    abandons: midAbandons,
                    tableMoney: midTableMoney
                  }}
                />

              </div>

              {/* BARRA DE RECUPERAÇÃO */}
              <div className="mt-4 bg-gradient-to-b from-[#111] to-[#0a0f0b] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#7cba10]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#7cba10]/15 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-[#7cba10]" />
                        O Dinheiro que volta pro Bolso
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Selecione uma taxa de conversão conservadora. Esse é o valor líquido que entra no seu caixa <strong className="text-white">sem aumentar o tráfego</strong>, apenas recuperando quem quase comprou.
                      </p>
                    </div>

                    {/* SELETOR DE TAXA */}
                    <div className="bg-[#050505] p-1 rounded-xl border border-white/10 flex items-center shrink-0">
                      {[10, 15, 20].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setRecoveryRate(rate as any)}
                          className={`px-6 py-2 rounded-lg text-sm font-bold font-mono transition-all duration-300 ${
                            recoveryRate === rate
                              ? "bg-[#7cba10] text-[#050505] shadow-[0_0_15px_rgba(124,186,16,0.4)]"
                              : "text-white/30 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* VALORES RECUPERADOS */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-[#0a0f0b] border border-[#7cba10]/20 hover:border-[#7cba10]/50 transition-colors flex items-center justify-between group/card">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">Cenário Low Ticket</div>
                        <div className="text-xs text-[#7cba10] font-mono opacity-60">Recuperando {recoveryRate}%</div>
                      </div>
                      <div className="text-3xl font-bold text-white tracking-tight group-hover/card:scale-105 transition-transform">
                        +{formatCurrency(lowRecovered)}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0a0f0b] border border-[#7cba10]/20 hover:border-[#7cba10]/50 transition-colors flex items-center justify-between group/card">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">Cenário Mid Ticket</div>
                        <div className="text-xs text-[#7cba10] font-mono opacity-60">Recuperando {recoveryRate}%</div>
                      </div>
                      <div className="text-3xl font-bold text-white tracking-tight group-hover/card:scale-105 transition-transform">
                        +{formatCurrency(midRecovered)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA FINAL */}
              <div className="pt-8 pb-4 text-center">
                <a 
                  href="https://app.cal.com/recupera.ia/30min" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-200 animate-pulse"></div>
                  <Button 
                    size="lg" 
                    className="relative bg-white hover:bg-gray-100 text-black font-bold h-16 px-10 rounded-full text-lg shadow-xl hover:scale-[1.02] transition-transform duration-200"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Diagnóstico com Sócio
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>

                <p className="mt-6 text-[10px] text-white/20 max-w-lg mx-auto uppercase tracking-widest font-mono">
                  * Números baseados na média de performance dos nossos clientes. Resultados podem variar conforme nicho e engajamento.
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTES PARA O NOVO DESIGN ---

function ScenarioCard({ 
  title, 
  ticket, 
  accentColor, 
  icon,
  metrics 
}: { 
  title: string, 
  ticket: string, 
  accentColor: "blue" | "green", 
  icon: React.ReactNode,
  metrics: { sales: number, revenue: number, ads: number, abandons: number, tableMoney: number }
}) {
  const isGreen = accentColor === "green"
  const borderColor = isGreen ? "border-[#7cba10]/20" : "border-blue-500/20"
  const hoverBorderColor = isGreen ? "hover:border-[#7cba10]/50" : "hover:border-blue-500/50"
  const iconBg = isGreen ? "bg-[#7cba10]/10 text-[#7cba10]" : "bg-blue-500/10 text-blue-400"
  const ticketBadge = isGreen ? "bg-[#7cba10]/10 text-[#7cba10] border-[#7cba10]/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"

  return (
    <Card className={`bg-[#0a0f0b] ${borderColor} ${hoverBorderColor} p-0 rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full`}>
      {/* Header do Card */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBg}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white leading-none">{title}</h3>
            <div className={`text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-full border w-fit ${ticketBadge}`}>
              TICKET MÉDIO: {ticket}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-grow">
        {/* Métricas Principais */}
        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-white/40 text-sm font-medium">Vendas Mensais</span>
            <span className="text-white font-mono text-lg">{Math.floor(metrics.sales)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-white/40 text-sm font-medium">Faturamento</span>
            <span className={`font-mono text-xl font-bold ${isGreen ? 'text-[#00ffc8]' : 'text-blue-200'}`}>
              {formatCurrency(metrics.revenue)}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-white/40 text-sm font-medium">Custo Tráfego</span>
            <span className="text-white/70 font-mono text-sm">{formatCurrency(metrics.ads)}</span>
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

        {/* Seção de Perda */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Abandonos (Estimado)</span>
            </div>
            <span className="text-white font-mono text-sm">{Math.floor(metrics.abandons)}</span>
          </div>
          
          <div className="bg-[#ff3b5c]/5 border border-[#ff3b5c]/10 rounded-xl p-3 relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1 h-full bg-[#ff3b5c]" />
            <div className="flex flex-col pl-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <AlertTriangle className="w-3 h-3 text-[#ff3b5c]" />
                <span className="text-[10px] font-bold text-[#ff3b5c] uppercase tracking-widest">Dinheiro na Mesa</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono tracking-tight">
                {formatCurrency(metrics.tableMoney)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
