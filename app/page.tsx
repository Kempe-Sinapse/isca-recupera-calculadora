"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Info,
  BarChart3,
  Sparkles,
  MessageSquare,
  Zap,
  Target,
  MousePointerClick,
  Layers,
  Banknote,
  CheckCircle2,
  Clock,
  BrainCircuit,
  CreditCard,
  Receipt,
  Bell
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  Cell
} from "recharts"

// --- TYPES ---
interface InputState {
  productPrice: number
  salesVolume: number
  upsell1Price: number
  upsell1Conv: number
  upsell2Price: number
  upsell2Conv: number
  cpa: number
}

interface Calculations {
  upsellPotential: number
  trueValuePerLead: number
  estimatedAbandonment: number
  monthlyLoss: number
  sunkCost: number
}

// --- COMPONENTS ---

// 1. Notification Feed (Terror Psicológico)
function NotificationFeed({ productPrice }: { productPrice: number }) {
  const [notifications, setNotifications] = useState<
    { id: number; text: string; time: string; value: string }[]
  >([])

  useEffect(() => {
    // Só começa se tiver um preço base, senão usa valor default
    const price = productPrice || 297
    
    const messages = [
      { text: "Novo abandono de carrinho identificado", value: price },
      { text: "Checkout iniciado sem conclusão", value: price },
      { text: "Sessão de pagamento expirada", value: price * 1.5 }, // Simulando upsell
      { text: "Falha no pagamento (Cartão)", value: price },
    ]

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)]
      const newNotif = {
        id: Date.now(),
        text: randomMsg.text,
        time: "Agora",
        value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
          randomMsg.value
        ),
      }

      setNotifications((prev) => [newNotif, ...prev].slice(0, 3)) // Mantém apenas as 3 últimas
    }, 4000) // Nova notificação a cada 4s

    return () => clearInterval(interval)
  }, [productPrice])

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 pointer-events-none hidden md:block">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#113313]/90 backdrop-blur-md border border-[#7cba10]/30 p-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]"
          >
            <div className="bg-[#ff3b5c]/20 p-2 rounded-full">
              <Bell className="w-4 h-4 text-[#ff3b5c]" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{notif.text}</p>
              <p className="text-[#ff3b5c] text-xs font-mono font-bold">-{notif.value}</p>
            </div>
            <span className="text-white/30 text-[10px] ml-auto">{notif.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function InsightCard({
  icon: Icon,
  title,
  children,
}: {
  icon: any
  title: string
  children: React.ReactNode
}) {
  return (
    <Card className="glass-card border-[#7cba10]/30 p-6 mt-6 hover:border-[#7cba10]/60 transition-all duration-300">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#7cba10]/20 flex items-center justify-center glow-primary">
            <Icon className="w-6 h-6 text-[#7cba10]" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 text-balance">{title}</h3>
          <p className="text-white/80 leading-relaxed text-pretty text-sm">{children}</p>
        </div>
      </div>
    </Card>
  )
}

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// --- MAIN PAGE ---

export default function RevenueRecoveryAudit() {
  const [step, setStep] = useState(0)
  const [inputs, setInputs] = useState<InputState>({
    productPrice: 0,
    salesVolume: 0,
    upsell1Price: 0,
    upsell1Conv: 10,
    upsell2Price: 0,
    upsell2Conv: 2,
    cpa: 0,
  })
  const [recoveryRate, setRecoveryRate] = useState(15)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  })

  // Calculate metrics
  const calculations: Calculations = {
    upsellPotential:
      inputs.upsell1Price * (inputs.upsell1Conv / 100) + inputs.upsell2Price * (inputs.upsell2Conv / 100),
    trueValuePerLead:
      inputs.productPrice +
      (inputs.upsell1Price * (inputs.upsell1Conv / 100) + inputs.upsell2Price * (inputs.upsell2Conv / 100)),
    estimatedAbandonment: inputs.salesVolume * 2.33,
    monthlyLoss:
      inputs.salesVolume *
      2.33 *
      (inputs.productPrice +
        (inputs.upsell1Price * (inputs.upsell1Conv / 100) + inputs.upsell2Price * (inputs.upsell2Conv / 100))),
    sunkCost: inputs.salesVolume * 2.33 * (inputs.cpa || inputs.productPrice * 0.3),
  }

  const recoveredRevenue = calculations.monthlyLoss * (recoveryRate / 100)
  const cpaActual = inputs.cpa || inputs.productPrice * 0.3
  const newLeadsEquivalent = Math.floor(recoveredRevenue / cpaActual)

  // Animation variants
  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6))
  const updateInput = (field: keyof InputState, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0a0f0b] tech-grid py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7cba10] opacity-10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00ffc8] opacity-5 blur-3xl rounded-full pointer-events-none" />

      {/* Notification Feed (Ativo a partir da etapa 1) */}
      {step > 0 && <NotificationFeed productPrice={inputs.productPrice} />}

      <div className="max-w-4xl mx-auto relative z-10">
        {step > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/50 font-mono">FASE DO DIAGNÓSTICO</span>
              <span className="text-sm text-[#7cba10] font-bold font-mono">{step}/6</span>
            </div>
            <div className="w-full h-2 bg-[#142415] rounded-full overflow-hidden border border-[#1e3a1f]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#7cba10] to-[#00ffc8] glow-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP 0: LANDING */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#7cba10] to-[#00ffc8] rounded-2xl flex items-center justify-center mb-6 glow-primary-strong rotate-45">
                    <TrendingUp className="w-12 h-12 text-[#0a0f0b] -rotate-45" strokeWidth={2.5} />
                  </div>
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-white tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="gradient-text">Auditoria de Lucro</span>
                  <br />
                  <span className="text-white/90">Invisível</span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed text-balance"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Descubra quanto dinheiro sua operação está queimando silenciosamente.
                  <span className="text-[#7cba10]"> Uma análise forense</span> do seu funil em 2 minutos.
                </motion.p>
              </div>

              <Button
                onClick={nextStep}
                size="lg"
                className="bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold text-lg px-12 py-6 h-auto glow-primary-strong transition-all duration-300 hover:scale-105"
              >
                <Zap className="mr-2 w-5 h-5" />
                Iniciar Diagnóstico
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {/* STEP 1: INPUTS */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">Calibragem do Diagnóstico</h2>
                </div>
                <p className="text-white/60 mb-8 font-mono text-sm max-w-2xl">
                  ALIMENTE O SIMULADOR COM SEUS DADOS REAIS PARA CALCULARMOS O VAZAMENTO.
                </p>

                <div className="space-y-6">
                  {/* Seção 1: Front-end */}
                  <div className="bg-[#113313]/50 rounded-xl p-6 border border-[#375e36]/50">
                    <div className="flex items-center gap-2 mb-3">
                      <MousePointerClick className="w-5 h-5 text-[#7cba10]" />
                      <h3 className="text-lg font-bold text-white">O Produto Isca (Front-end)</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productPrice" className="text-white mb-2 block font-medium">Preço (R$)</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          placeholder="Ex: 297"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] h-12"
                          onChange={(e) => updateInput("productPrice", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="salesVolume" className="text-white mb-2 block font-medium">Vendas/Mês (Qtd)</Label>
                        <Input
                          id="salesVolume"
                          type="number"
                          placeholder="Ex: 150"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] h-12"
                          onChange={(e) => updateInput("salesVolume", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção 2: Upsells */}
                  <div className="bg-[#113313]/50 rounded-xl p-6 border border-[#375e36]/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-5 h-5 text-[#7cba10]" />
                      <h3 className="text-lg font-bold text-white">Upsells (A Margem Invisível)</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-8">
                          <Label className="text-white mb-2 block font-medium text-sm">Upsell 1 (Order Bump)</Label>
                          <Input
                            type="number"
                            placeholder="Ex: 47"
                            className="bg-[#113313] border-[#375e36] text-white focus:border-[#7cba10]"
                            onChange={(e) => updateInput("upsell1Price", Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-4">
                          <Label className="text-white mb-2 block font-medium text-xs">Conv. (%)</Label>
                          <Input
                            type="number"
                            defaultValue={10}
                            className="bg-[#113313] border-[#375e36] text-white text-center focus:border-[#7cba10]"
                            onChange={(e) => updateInput("upsell1Conv", Number(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-8">
                          <Label className="text-white mb-2 block font-medium text-sm">Upsell 2 (High Ticket)</Label>
                          <Input
                            type="number"
                            placeholder="Ex: 997"
                            className="bg-[#113313] border-[#375e36] text-white focus:border-[#7cba10]"
                            onChange={(e) => updateInput("upsell2Price", Number(e.target.value))}
                          />
                        </div>
                        <div className="col-span-4">
                          <Label className="text-white mb-2 block font-medium text-xs">Conv. (%)</Label>
                          <Input
                            type="number"
                            defaultValue={2}
                            className="bg-[#113313] border-[#375e36] text-white text-center focus:border-[#7cba10]"
                            onChange={(e) => updateInput("upsell2Conv", Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção 3: CPA */}
                  <div className="bg-[#113313]/50 rounded-xl p-6 border border-[#375e36]/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Banknote className="w-5 h-5 text-[#ff3b5c]" />
                      <h3 className="text-lg font-bold text-white">Custo de Tráfego</h3>
                    </div>
                    <p className="text-xs text-white/50 mb-3 font-mono">
                      Seu CPA (Custo por Aquisição). Quanto você paga para o Meta/Google por venda?
                    </p>
                    <Input
                      type="number"
                      placeholder="Ex: R$ 45,00"
                      className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] h-12"
                      onChange={(e) => updateInput("cpa", Number(e.target.value))}
                    />
                  </div>
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] text-[#0a0f0b] font-bold h-14 text-lg"
                  disabled={!inputs.productPrice || !inputs.salesVolume}
                >
                  Calcular Perdas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: DIAGNOSIS (STACKED CHART) */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Card className="glass-card border-[#ff3b5c]/30 p-8 text-center glow-error">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <AlertCircle className="w-10 h-10 text-[#ff3b5c]" />
                  <h2 className="text-3xl font-bold text-white">A Anatomia do Prejuízo</h2>
                </div>

                {/* GRÁFICO DE PILHA (STACKED) */}
                <div className="bg-[#0d1b0e] rounded-xl p-6 mb-6 border border-[#ff3b5c]/20 h-[350px]">
                  <p className="text-white/60 text-sm mb-4 font-mono text-left">ANÁLISE POR LEAD ABANDONADO:</p>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={[{
                        name: "Abandono",
                        CPA: cpaActual,
                        LucroPerdido: calculations.trueValuePerLead
                      }]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis stroke="#ffffff" fontSize={12} tickFormatter={(val) => `R$${val}`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#113313', borderColor: '#375e36', color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Bar name="Mídia Jogada Fora (CPA)" dataKey="CPA" stackId="a" fill="#7f1d1d" radius={[0, 0, 8, 8]} />
                      <Bar name="Potencial de Lucro Perdido" dataKey="LucroPerdido" stackId="a" fill="#ff3b5c" radius={[8, 8, 0, 0]}>
                         <LabelList dataKey="LucroPerdido" position="top" fill="#ff3b5c" formatter={(val: number) => formatCurrency(val + cpaActual)} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between items-center bg-[#ff3b5c]/10 p-4 rounded-lg border border-[#ff3b5c]/20">
                  <div className="text-left">
                    <p className="text-[#ff3b5c] font-bold text-sm">PREJUÍZO MENSAL TOTAL</p>
                    <p className="text-xs text-white/50">Soma de todos os abandonos</p>
                  </div>
                  <div className="text-3xl font-bold text-[#ff3b5c]">
                    {formatCurrency(calculations.monthlyLoss)}
                  </div>
                </div>

                <InsightCard icon={Lightbulb} title="O Efeito Multiplicador Negativo">
                  O abandono não é "zero a zero". É negativo. Primeiro, você perdeu o <strong>R$ {cpaActual.toFixed(2)}</strong> que pagou para trazer o lead (CPA). Segundo, você deixou de ganhar o lucro do produto principal e dos upsells. É um prejuízo duplo.
                </InsightCard>

                <Button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] text-[#0a0f0b] font-bold"
                >
                  Entender a Margem Real
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: UNIT ECONOMICS (NEW vs RECOVERED) */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">Lucro Tráfego vs. Recuperação</h2>
                </div>
                <p className="text-white/60 mb-8 font-mono text-sm">QUAL DINHEIRO VALE MAIS?</p>

                <div className="bg-[#0d1b0e] rounded-xl p-6 mb-6 border border-[#7cba10]/20 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Venda Nova (Tráfego)",
                          Custo: cpaActual,
                          Lucro: inputs.productPrice - cpaActual,
                        },
                        {
                          name: "Venda Recuperada",
                          Custo: inputs.productPrice * 0.20, // 20% comissão
                          Lucro: inputs.productPrice * 0.80,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" stroke="#ffffff" fontSize={12} fontWeight="bold" />
                      <YAxis stroke="#ffffff" tickFormatter={(val) => `R$${val}`} />
                      <RechartsTooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#113313', borderColor: '#375e36', color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend verticalAlign="top" height={36}/>
                      <Bar name="Custo (CPA ou Comissão)" dataKey="Custo" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                      <Bar name="Margem de Contribuição" dataKey="Lucro" stackId="a" fill="#7cba10" radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="Lucro" position="top" fill="#ffffff" formatter={(val: number) => formatCurrency(val)} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center mb-6">
                  <p className="text-white text-lg font-medium">
                    "Para colocar <span className="text-[#7cba10] font-bold">R$ 10k</span> no bolso com tráfego, você precisa faturar muito mais para cobrir o CPA. 
                    Com recuperação, a margem é superior porque o custo é variável (apenas sobre o êxito)."
                  </p>
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-[#7cba10] to-[#00ffc8] text-[#0a0f0b] font-bold"
                >
                  Ver Cenários de Futuro
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: SCENARIOS (OPTIONS) */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">O Poder da Caixa Extra</h2>
                </div>
                
                <div className="bg-[#0d1b0e] rounded-xl p-6 mb-8 border border-[#7cba10]/20">
                  <Label className="text-white text-lg mb-4 block font-semibold">
                    Se recuperarmos <span className="text-[#7cba10] font-bold font-mono">{recoveryRate}%</span> das vendas:
                  </Label>
                  <Slider
                    value={[recoveryRate]}
                    onValueChange={(value) => setRecoveryRate(value[0])}
                    min={5}
                    max={30}
                    step={1}
                    className="mb-6"
                  />
                  
                  <div className="text-center">
                    <p className="text-white/60 text-sm font-mono mb-2">RECEITA RECUPERADA MENSAL</p>
                    <p className="text-5xl font-bold text-[#7cba10] gradient-text">{formatCurrency(recoveredRevenue)}</p>
                  </div>
                </div>

                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" />
                  O Que Fazer Com Esse Dinheiro?
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* OPÇÃO A */}
                  <div className="bg-[#142415] p-5 rounded-lg border border-[#375e36] hover:border-[#7cba10] transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white">Opção A: Dividendos</h4>
                      <CreditCard className="w-5 h-5 text-white/50 group-hover:text-[#7cba10]" />
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                      Retire esse valor como lucro líquido para os sócios. Aumente a rentabilidade da empresa sem esforço operacional.
                    </p>
                  </div>

                  {/* OPÇÃO B */}
                  <div className="bg-[#142415] p-5 rounded-lg border border-[#375e36] hover:border-[#00ffc8] transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white">Opção B: Reinvestimento</h4>
                      <TrendingUp className="w-5 h-5 text-white/50 group-hover:text-[#00ffc8]" />
                    </div>
                    <p className="text-xs text-white/60 mb-2 leading-relaxed">
                      Use o caixa para comprar tráfego. Com esse valor, você compra:
                    </p>
                    <p className="text-xl font-bold text-[#00ffc8]">+{newLeadsEquivalent} Leads/mês</p>
                  </div>
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-[#7cba10] to-[#00ffc8] text-[#0a0f0b] font-bold"
                >
                  Ver Como Funciona a Mágica
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 5: SOLUTION (WHATSAPP SIMULATION WITH HOTSPOTS) */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">A Conversão Invisível</h2>
                </div>

                <div className="bg-[#0b141a] rounded-xl overflow-hidden border border-[#1e2a22] relative max-w-md mx-auto shadow-2xl">
                  {/* Header Zap */}
                  <div className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-[#1e2a22]">
                    <div className="w-8 h-8 rounded-full bg-[#7cba10] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#0a0f0b]" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Recupera.ia Assistente</p>
                      <p className="text-white/40 text-xs">Online agora</p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 min-h-[300px]">
                    
                    {/* Msg 1 */}
                    <motion.div 
                      initial={{opacity: 0, x: -20}} 
                      animate={{opacity: 1, x: 0}} 
                      transition={{delay: 0.5}}
                      className="relative group"
                    >
                      <div className="bg-[#202c33] text-white p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm shadow-md">
                        Olá Carlos! 👋 Vi que você iniciou sua inscrição no curso mas não finalizou. Aconteceu algo?
                        <span className="text-[10px] text-white/30 block text-right mt-1">10:02</span>
                      </div>
                      
                      {/* Hotspot 1: Timing */}
                      <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#7cba10] rounded-full animate-pulse flex items-center justify-center cursor-pointer shadow-[0_0_15px_#7cba10]">
                        <Clock className="w-3 h-3 text-black" />
                      </div>
                      <div className="absolute left-full ml-4 top-0 w-48 bg-[#113313] p-3 rounded-lg border border-[#7cba10] text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <strong>Timing de Ouro:</strong> Enviado em &lt; 5 min. Aproveita a dopamina da compra ainda ativa.
                      </div>
                    </motion.div>

                    {/* Msg 2 (User) */}
                    <motion.div 
                      initial={{opacity: 0, x: 20}} 
                      animate={{opacity: 1, x: 0}} 
                      transition={{delay: 1.5}}
                      className="flex justify-end"
                    >
                      <div className="bg-[#005c4b] text-white p-3 rounded-lg rounded-tr-none max-w-[85%] text-sm shadow-md">
                        Achei o valor um pouco alto para pagar à vista agora.
                        <span className="text-[10px] text-white/30 block text-right mt-1">10:05</span>
                      </div>
                    </motion.div>

                    {/* Msg 3 (AI) */}
                    <motion.div 
                      initial={{opacity: 0, x: -20}} 
                      animate={{opacity: 1, x: 0}} 
                      transition={{delay: 2.5}}
                      className="relative group"
                    >
                      <div className="bg-[#202c33] text-white p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm shadow-md">
                        Entendo perfeitamente. Mas o módulo 3 sozinho já paga o investimento. <br/><br/>
                        Consegui liberar um parcelamento inteligente em 12x no boleto para você. Ajuda?
                        <span className="text-[10px] text-white/30 block text-right mt-1">10:05</span>
                      </div>
                      {/* Hotspot 2: Objection */}
                      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#00ffc8] rounded-full animate-pulse flex items-center justify-center cursor-pointer shadow-[0_0_15px_#00ffc8]">
                        <BrainCircuit className="w-3 h-3 text-black" />
                      </div>
                       <div className="absolute left-full ml-4 top-0 w-48 bg-[#113313] p-3 rounded-lg border border-[#00ffc8] text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <strong>Cérebro de Vendas:</strong> A IA detectou objeção de preço e ofereceu condição especial automaticamente.
                      </div>
                    </motion.div>
                     
                     {/* Msg 4 (Link) */}
                    <motion.div 
                      initial={{opacity: 0, x: -20}} 
                      animate={{opacity: 1, x: 0}} 
                      transition={{delay: 3.5}}
                      className="relative group"
                    >
                       <div className="bg-[#202c33] text-white p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm shadow-md border-l-4 border-[#7cba10]">
                        💳 <strong>Link de Checkout Seguro</strong><br/>
                        <span className="text-[#00ffc8] underline">recupera.ia/checkout/carlos-12x</span>
                        <span className="text-[10px] text-white/30 block text-right mt-1">10:05</span>
                      </div>
                       {/* Hotspot 3: Link */}
                       <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-[#ffffff] rounded-full animate-pulse flex items-center justify-center cursor-pointer shadow-[0_0_15px_#ffffff]">
                        <MousePointerClick className="w-3 h-3 text-black" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <p className="text-center text-white/50 text-sm mt-6 mb-6">
                  *Passe o mouse sobre os pontos piscantes para entender a estratégia.
                </p>

                <Button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-[#7cba10] to-[#00ffc8] text-[#0a0f0b] font-bold"
                >
                  Quero Esse Sistema
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 6: CTA (RECEIPT & PLAN) */}
          {step === 6 && (
            <motion.div
              key="step6"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary-strong">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#7cba10] to-[#00ffc8] rounded-2xl flex items-center justify-center mb-6 glow-primary-strong">
                    <CheckCircle2 className="w-10 h-10 text-[#0a0f0b]" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 gradient-text">Auditoria Finalizada</h2>
                  <p className="text-white/70 font-mono text-sm">SEU PLANO DE RESGATE ESTÁ PRONTO</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  
                  {/* Visual do Ticket/Recibo */}
                  <div className="bg-white text-black p-6 rounded-sm shadow-xl font-mono text-sm relative rotate-1 transform hover:rotate-0 transition-transform duration-500">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[linear-gradient(45deg,transparent_50%,#fff_50%),linear-gradient(-45deg,transparent_50%,#fff_50%)] bg-[length:10px_10px] -mt-2"></div>
                    
                    <div className="text-center border-b-2 border-dashed border-black/20 pb-4 mb-4">
                      <h3 className="font-bold text-xl">RECUPERA.IA</h3>
                      <p className="text-xs text-gray-500">RELATÓRIO DE DIAGNÓSTICO #2024</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>ITEM</span>
                        <span>VALOR</span>
                      </div>
                      <div className="w-full h-px bg-black/10"></div>
                      <div className="flex justify-between text-red-600 font-bold">
                        <span>PERDA MENSAL (CPA+LUCRO)</span>
                        <span>{formatCurrency(calculations.monthlyLoss)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TAXA DE ABANDONO ESTIMADA</span>
                        <span>70%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LEADS PERDIDOS/MÊS</span>
                        <span>{Math.floor(inputs.salesVolume * 2.33)}</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-black/20 pt-4 mt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>POTENCIAL RESGATE:</span>
                        <span className="text-[#0a0f0b] bg-[#7cba10] px-1">{formatCurrency(recoveredRevenue)}</span>
                      </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-400">
                      <Receipt className="w-4 h-4 mx-auto mb-1" />
                      DOCUMENTO NÃO FISCAL
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-[linear-gradient(45deg,transparent_50%,#fff_50%),linear-gradient(-45deg,transparent_50%,#fff_50%)] bg-[length:10px_10px] -mb-2 rotate-180"></div>
                  </div>

                  {/* Formulário */}
                  <div className="space-y-4 pt-2">
                     <p className="text-white text-sm mb-4">
                       Preencha seus dados para receber este diagnóstico detalhado e agendar a implementação da IA.
                     </p>
                    <div>
                      <Label htmlFor="name" className="text-white mb-2 block font-semibold">Nome</Label>
                      <Input
                        id="name"
                        className="bg-[#113313] border-[#375e36] text-white h-12"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp" className="text-white mb-2 block font-semibold">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        className="bg-[#113313] border-[#375e36] text-white h-12"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      />
                    </div>

                    <Button
                      onClick={() => alert("Solicitação enviada! Entraremos em contato.")}
                      className="w-full mt-4 bg-white text-[#0a0f0b] hover:bg-[#e2e2e2] font-bold text-lg py-6"
                      disabled={!formData.name || !formData.whatsapp}
                    >
                      Gerar Plano de Resgate
                    </Button>
                  </div>

                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
