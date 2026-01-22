"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  Users,
  ArrowRight,
  DollarSign,
  ShoppingCart,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

// --- TYPES & UTILS ---

// Formata moeda (BRL)
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

// Formata números (ex: 1.500)
function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value)
}

export default function FollowerPotentialCalculator() {
  const [step, setStep] = useState(0)
  const [followers, setFollowers] = useState<number | "">("")
  const [recoveryRate, setRecoveryRate] = useState<10 | 15 | 20>(15)

  // --- CÁLCULOS (BACKEND LOGIC NO FRONT) ---
  
  const f = Number(followers) || 0

  // 1. Funil Mid Ticket
  // 0,65% de vendas
  const midSales = f * 0.0065
  // Ticket R$ 200
  const midRevenue = midSales * 200
  // 30% do ticket * vendas
  const midAdsCost = (200 * 0.30) * midSales
  // 70% das vendas = abandonos
  const midAbandons = midSales * 0.70
  // Dinheiro na mesa
  const midTableMoney = midAbandons * 200
  // Recuperado (baseado no seletor)
  const midRecovered = midTableMoney * (recoveryRate / 100)

  // 2. Funil Low Ticket
  // 1% de vendas
  const lowSales = f * 0.01
  // Ticket R$ 70
  const lowRevenue = lowSales * 70
  // 30% do ticket * vendas
  const lowAdsCost = (70 * 0.30) * lowSales
  // 130% das vendas = abandonos
  const lowAbandons = lowSales * 1.30
  // Dinheiro na mesa
  const lowTableMoney = lowAbandons * 70
  // Recuperado (baseado no seletor)
  const lowRecovered = lowTableMoney * (recoveryRate / 100)

  // Animação dos slides
  const slideVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  }

  const handleNext = () => {
    if (Number(followers) > 0) {
      setStep(1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f0b] text-white font-sans overflow-x-hidden selection:bg-[#7cba10] selection:text-[#0a0f0b]">
      {/* Background Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#7cba10] opacity-10 blur-[128px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#00ffc8] opacity-5 blur-[128px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header Simples */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7cba10] rounded-lg flex items-center justify-center">
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Simulador de Escala</span>
          </div>
          {step === 1 && (
            <Button 
              variant="ghost" 
              onClick={() => setStep(0)}
              className="text-white/50 hover:text-[#7cba10]"
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Descubra o Potencial Oculto da sua <span className="text-[#7cba10]">Audiência</span>
                </h1>
                <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
                  Insira o tamanho da sua base e nós projetaremos dois cenários de faturamento e o dinheiro que você está deixando na mesa hoje.
                </p>

                <div className="bg-[#142415] border border-[#1e3a1f] p-2 rounded-2xl flex items-center gap-2 shadow-2xl shadow-[#7cba10]/10 max-w-md mx-auto">
                  <div className="pl-4 text-white/40">
                    <Users className="w-6 h-6" />
                  </div>
                  <Input
                    type="number"
                    placeholder="Quantidade de seguidores (ex: 50000)"
                    className="border-none bg-transparent text-xl h-14 text-white placeholder:text-white/20 focus-visible:ring-0 shadow-none"
                    value={followers}
                    onChange={(e) => setFollowers(Number(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    autoFocus
                  />
                  <Button
                    onClick={handleNext}
                    className="h-12 px-8 rounded-xl bg-[#7cba10] hover:bg-[#6aa80e] text-black font-bold text-base transition-all hover:scale-105"
                    disabled={!followers}
                  >
                    Simular
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ETAPA 1: RESULTADOS */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="mb-8 text-center md:text-left">
                 <h2 className="text-2xl md:text-3xl font-bold text-white">
                   Resultados para <span className="text-[#7cba10]">{formatNumber(f)} seguidores</span>
                 </h2>
                 <p className="text-white/50 text-sm mt-1">Comparativo de performance entre modelos de negócio</p>
              </div>

              {/* GRID DOS 2 CENÁRIOS */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                
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
              <div className="bg-[#0f1a12] border border-[#7cba10]/30 rounded-2xl p-6 md:p-10 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7cba10]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-[#7cba10]" />
                        O Poder da Recuperação
                      </h3>
                      <p className="text-white/60 text-sm max-w-xl">
                        Ajuste a taxa de conversão abaixo para ver quanto dinheiro extra entraria no seu caixa 
                        apenas convertendo quem já demonstrou interesse, <span className="text-white font-bold">sem gastar 1 real a mais em anúncios.</span>
                      </p>
                    </div>

                    {/* SELETOR 10% 15% 20% */}
                    <div className="bg-[#0a0f0b] p-1 rounded-lg border border-[#1e3a1f] flex items-center">
                      {[10, 15, 20].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setRecoveryRate(rate as any)}
                          className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                            recoveryRate === rate
                              ? "bg-[#7cba10] text-[#0a0f0b] shadow-lg shadow-[#7cba10]/20"
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

              <div className="mt-12 text-center">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-10 py-6 text-lg rounded-full">
                  Quero Implementar a Recuperação
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTES PARA ORGANIZAÇÃO ---

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
    <Card className="bg-[#0d140e]/80 backdrop-blur-sm border border-[#1e3a1f] p-6 rounded-2xl hover:border-[#7cba10]/30 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1e3a1f]">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${badgeColor.split(' ')[2]} ${badgeColor.split(' ')[0]} bg-opacity-10`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeColor}`}>
              Ticket Médio: {ticket}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <MetricRow label="Vendas Mensais" value={Math.floor(metrics.sales)} isCurrency={false} />
        <MetricRow label="Faturamento Mensal" value={metrics.revenue} isCurrency={true} highlight />
        <MetricRow label="Custo de Tráfego" value={metrics.ads} isCurrency={true} subtext="(Mensal)" />
        
        <div className="my-6 border-t border-dashed border-[#1e3a1f]" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" /> Abandonos Mensais
            </span>
            <span className="text-white font-mono">{Math.floor(metrics.abandons)}</span>
          </div>
          
          <div className="bg-[#ff3b5c]/5 border border-[#ff3b5c]/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1 text-[#ff3b5c]">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Dinheiro na Mesa</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(metrics.tableMoney)}
            </p>
            <p className="text-[10px] text-white/40 mt-1">
              Faturamento perdido em checkouts abandonados
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

function MetricRow({ label, value, isCurrency, highlight, subtext }: { label: string, value: number, isCurrency: boolean, highlight?: boolean, subtext?: string }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-white/60 text-sm">{label} {subtext && <span className="text-[10px] opacity-70">{subtext}</span>}</span>
      <span className={`font-mono font-medium ${highlight ? 'text-[#00ffc8] text-lg' : 'text-white'}`}>
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </span>
    </div>
  )
}

function RecoveryResult({ label, value, rate }: { label: string, value: number, rate: number }) {
  return (
    <div className="bg-[#0a0f0b] border border-[#1e3a1f] p-4 rounded-xl flex flex-col justify-between h-full hover:border-[#7cba10]/50 transition-colors">
      <span className="text-xs text-white/50 uppercase font-bold tracking-wider mb-2">{label}</span>
      <div>
        <div className="text-xs text-[#7cba10] mb-1 font-mono">RECUPERANDO {rate}%:</div>
        <div className="text-2xl md:text-3xl font-bold text-white gradient-text">
          +{formatCurrency(value)}
        </div>
        <p className="text-[10px] text-white/30 mt-2">
          Receita adicional líquida estimada/mês
        </p>
      </div>
    </div>
  )
}
