"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  ArrowRight,
  TrendingUp,
  BarChart3,
  DollarSign,
  Sparkles,
  AlertCircle,
  Zap,
  Target,
  MessageSquare,
  Info,
} from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { createClient } from "@/lib/supabase/client"

// Types
interface InputState {
  monthlyVisits: number
  checkoutRate: number
  conversionRate: number
  productPrice: number
  cac: number
}

interface Calculations {
  upsellPotential: number
  trueValuePerLead: number
  estimatedAbandonment: number
  monthlyLoss: number
  annualLoss: number
  sunkCost: number
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
          <h3 className="text-xl font-bold text-white mb-3 text-balance">{title}</h3>
          <p className="text-white/80 leading-relaxed text-pretty">{children}</p>
        </div>
      </div>
    </Card>
  )
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block">
      <Info className="w-4 h-4 text-[#7cba10] cursor-help" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-3 glass-card rounded-lg text-sm text-white -left-28 top-6 shadow-lg border border-[#7cba10]/20 bg-[#0a0f0b]/95 backdrop-blur-md">
        {text}
      </div>
    </div>
  )
}

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function RevenueAudit() {
  const [step, setStep] = useState(0)
  const [inputs, setInputs] = useState<InputState>({
    monthlyVisits: 0,
    checkoutRate: 0,
    conversionRate: 0,
    productPrice: 0,
    cac: 0,
  })
  const [recoveryRate, setRecoveryRate] = useState(10)
  const [formData, setFormData] = useState({ name: "", email: "", whatsapp: "" })
  const [leadId, setLeadId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate metrics
  const calculations: Calculations = {
    upsellPotential: 0,
    trueValuePerLead: inputs.productPrice,
    estimatedAbandonment: inputs.monthlyVisits * (1 - inputs.checkoutRate / 100),
    monthlyLoss: inputs.monthlyVisits * (1 - inputs.checkoutRate / 100) * inputs.productPrice,
    annualLoss: inputs.monthlyVisits * (1 - inputs.checkoutRate / 100) * inputs.productPrice * 12,
    sunkCost: inputs.monthlyVisits * (1 - inputs.checkoutRate / 100) * (inputs.cac || inputs.productPrice * 0.3),
  }

  const recoveredRevenue = calculations.monthlyLoss * (recoveryRate / 100)
  const newLeadsEquivalent = Math.floor(recoveredRevenue / (inputs.cac || inputs.productPrice * 0.3))

  // Animation variants
  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  }

  const saveBusinessData = async () => {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("leads")
      .insert({
        monthly_visits: inputs.monthlyVisits,
        checkout_rate: inputs.checkoutRate,
        conversion_rate: inputs.conversionRate,
        product_price: inputs.productPrice,
        cac: inputs.cac || null,
        monthly_loss: calculations.monthlyLoss,
        annual_loss: calculations.annualLoss,
        true_value_per_lead: calculations.trueValuePerLead,
      })
      .select("id")
      .single()

    if (error) {
      console.log("[v0] Error saving business data:", error)
      return null
    }

    console.log("[v0] Lead created with ID:", data.id)
    return data.id
  }

  const savePersonalData = async () => {
    if (!leadId) {
      console.log("[v0] No leadId found, cannot save personal data")
      return false
    }

    const supabase = createClient()

    const { error } = await supabase
      .from("leads")
      .update({
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        recovered_revenue: recoveredRevenue,
        recovery_rate: recoveryRate,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)

    if (error) {
      console.log("[v0] Error saving personal data:", error)
      return false
    }

    console.log("[v0] Lead updated with personal data")
    return true
  }

  const nextStep = async () => {
    if (step === 1) {
      const id = await saveBusinessData()
      if (id) {
        setLeadId(id)
      }
    }
    setStep((prev) => prev + 1)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    const success = await savePersonalData()
    setIsSubmitting(false)

    if (success) {
      alert("Formulário enviado! Em breve nossa equipe entrará em contato.")
    } else {
      alert("Ocorreu um erro. Por favor, tente novamente.")
    }
  }

  const updateInput = (field: keyof InputState, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0a0f0b] tech-grid py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7cba10] opacity-10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00ffc8] opacity-5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {step > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/50 font-mono">PROGRESSO</span>
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
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
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
                  transition={{ delay: 0.3 }}
                >
                  <span className="gradient-text">Auditoria de Lucro</span>
                  <br />
                  <span className="text-white/90">Invisível</span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed text-balance"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Descubra quanto dinheiro sua operação está queimando silenciosamente.
                  <span className="text-[#7cba10]"> Uma análise forense</span> do seu funil de vendas em 2 minutos.
                </motion.p>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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

              <motion.p
                className="text-sm text-white/30 mt-8 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                POWERED BY RECUPERA.IA
              </motion.p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">Calibragem do Diagnóstico</h2>
                </div>
                <p className="text-white/60 mb-8 font-mono text-sm max-w-2xl">
                  ALIMENTE O SIMULADOR COM SEUS DADOS REAIS PARA CALCULARMOS O TAMANHO EXATO DO VAZAMENTO FINANCEIRO.
                </p>

                <div className="space-y-6">
                  {/* Seção 1: Front-end */}
                  <div className="bg-[#113313]/50 rounded-xl p-6 border border-[#375e36]/50">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowRight className="w-5 h-5 text-[#7cba10]" />
                      <h3 className="text-lg font-bold text-white">O Produto Isca (Front-end)</h3>
                    </div>
                    <p className="text-xs text-white/50 mb-4 font-mono leading-relaxed">
                      Este é o seu ponto de entrada. A maioria dos abandonos acontece aqui, mas o prejuízo real é o que
                      vem depois.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyVisits" className="text-white mb-2 block font-medium">
                          Visitas Mensais (Qtd)
                        </Label>
                        <Input
                          id="monthlyVisits"
                          type="number"
                          placeholder="Ex: 1000"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all h-12"
                          onChange={(e) => updateInput("monthlyVisits", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkoutRate" className="text-white mb-2 block font-medium">
                          Taxa de Checkout (%)
                        </Label>
                        <Input
                          id="checkoutRate"
                          type="number"
                          placeholder="Ex: 20"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all h-12"
                          onChange={(e) => updateInput("checkoutRate", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="conversionRate" className="text-white mb-2 block font-medium">
                          Taxa de Conversão (%)
                        </Label>
                        <Input
                          id="conversionRate"
                          type="number"
                          placeholder="Ex: 10"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all h-12"
                          onChange={(e) => updateInput("conversionRate", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="productPrice" className="text-white mb-2 block font-medium">
                          Preço do Produto (R$)
                        </Label>
                        <Input
                          id="productPrice"
                          type="number"
                          placeholder="Ex: 297"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all h-12"
                          onChange={(e) => updateInput("productPrice", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cac" className="text-white mb-2 block font-medium">
                          Custo por Aquisição (CAC)
                        </Label>
                        <Input
                          id="cac"
                          type="number"
                          placeholder="Ex: R$ 45,00"
                          className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all h-12"
                          onChange={(e) => updateInput("cac", Number(e.target.value))}
                        />
                        <p className="text-[10px] text-white/30 mt-2 font-mono uppercase tracking-wider">
                          *Se deixar vazio, calcularemos uma média de mercado (30% do Front).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold glow-primary transition-all duration-300 hover:scale-[1.02] h-14 text-lg"
                  disabled={!inputs.productPrice || !inputs.monthlyVisits || !inputs.checkoutRate}
                >
                  Continuar Análise
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-[#ff3b5c]/30 p-8 text-center glow-error">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <AlertCircle className="w-20 h-20 text-[#ff3b5c] mx-auto mb-6" strokeWidth={1.5} />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-4 font-mono">DIAGNÓSTICO CRÍTICO</h2>

                <div className="my-12">
                  <p className="text-white/60 text-lg mb-4 font-mono text-sm">DINHEIRO DEIXADO NA MESA ESTE MÊS</p>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
                  >
                    {formatCurrency(calculations.monthlyLoss)}
                  </motion.div>
                  <p className="text-xl text-white/80">
                    Isso equivale a{" "}
                    <span className="text-[#ff3b5c] font-bold">
                      {Math.floor(calculations.monthlyLoss / inputs.productPrice)}
                    </span>{" "}
                    vendas do seu produto principal jogadas fora.
                  </p>
                </div>

                <InsightCard icon={AlertCircle} title="O Conceito de LTV Invisível">
                  Você não perdeu apenas o valor do primeiro produto. Estatisticamente, quem abandona leva embora o
                  potencial de lucro dos seus Upsells. Sua perda real por lead é{" "}
                  <strong className="text-[#7cba10]">{formatCurrency(calculations.trueValuePerLead)}</strong>, não{" "}
                  <span className="line-through">{formatCurrency(inputs.productPrice)}</span>.
                </InsightCard>

                <Button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold glow-primary transition-all duration-300 hover:scale-[1.02]"
                >
                  Entender Melhor
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">A Falácia do Custo Afundado</h2>
                </div>
                <p className="text-white/60 mb-8 font-mono text-sm">ENTENDA A DIFERENÇA DE MARGEM</p>

                <div className="bg-[#0d1b0e] rounded-xl p-6 mb-6 border border-[#7cba10]/20">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        {
                          name: "Venda Nova",
                          custo: inputs.cac || inputs.productPrice * 0.3,
                          lucro: calculations.trueValuePerLead - (inputs.cac || inputs.productPrice * 0.3),
                        },
                        {
                          name: "Venda Recuperada",
                          custo: 0,
                          lucro: calculations.trueValuePerLead,
                        },
                      ]}
                    >
                      <XAxis dataKey="name" stroke="#7cba10" style={{ fontSize: "14px", fontWeight: "bold" }} />
                      <YAxis stroke="#7cba10" />
                      <Bar dataKey="custo" stackId="a" fill="#ff3b5c" radius={[0, 0, 8, 8]} />
                      <Bar dataKey="lucro" stackId="a" fill="#7cba10" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#ff3b5c] rounded" />
                      <span className="text-white/70 text-sm font-mono">Custo de Tráfego/CAC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#7cba10] rounded" />
                      <span className="text-white/70 text-sm font-mono">Lucro</span>
                    </div>
                  </div>
                </div>

                <InsightCard icon={DollarSign} title="Margem Infinita">
                  Para fazer uma venda nova, você gasta marketing. Para recuperar uma venda, o custo é zero, pois o lead
                  já foi pago. <strong className="text-[#7cba10]">Recuperação é lucro limpo direto no caixa.</strong>
                </InsightCard>

                <Button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold glow-primary transition-all duration-300 hover:scale-[1.02]"
                >
                  Ver Potencial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">O Efeito Dominó</h2>
                </div>
                <p className="text-white/60 mb-8 font-mono text-sm">AJUSTE A TAXA DE RECUPERAÇÃO</p>

                <div className="bg-[#0d1b0e] rounded-xl p-6 mb-8 border border-[#7cba10]/20">
                  <Label className="text-white text-lg mb-4 block font-semibold">
                    Taxa de Recuperação: <span className="text-[#7cba10] font-bold font-mono">{recoveryRate}%</span>
                  </Label>
                  <Slider
                    value={[recoveryRate]}
                    onValueChange={(value) => setRecoveryRate(value[0])}
                    min={5}
                    max={30}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-white/40 font-mono">
                    <span>5%</span>
                    <span>30%</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-[#0d1b0e] border-[#7cba10]/50 p-6 text-center hover:border-[#7cba10] transition-all duration-300 glow-primary">
                    <BarChart3 className="w-8 h-8 text-[#7cba10] mx-auto mb-3" />
                    <p className="text-white/60 text-sm mb-2 font-mono">RECEITA EXTRA MENSAL</p>
                    <p className="text-2xl font-bold text-[#7cba10]">{formatCurrency(recoveredRevenue)}</p>
                  </Card>

                  <Card className="bg-[#0d1b0e] border-[#00ffc8]/50 p-6 text-center hover:border-[#00ffc8] transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-[#00ffc8] mx-auto mb-3" />
                    <p className="text-white/60 text-sm mb-2 font-mono">RECEITA EXTRA ANUAL</p>
                    <p className="text-2xl font-bold text-[#00ffc8]">{formatCurrency(recoveredRevenue * 12)}</p>
                  </Card>

                  <Card className="bg-[#0d1b0e] border-[#4d9fff]/50 p-6 text-center hover:border-[#4d9fff] transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-[#4d9fff] mx-auto mb-3" />
                    <p className="text-white/60 text-sm mb-2 font-mono">PODER DE REINVESTIMENTO</p>
                    <p className="text-2xl font-bold text-[#4d9fff]">+{newLeadsEquivalent} leads</p>
                  </Card>
                </div>

                <p className="text-center text-white/80 text-lg mb-6 text-balance">
                  Isso é dinheiro que você não precisa buscar com novos leads. É o resgate de investimento já feito.
                </p>

                <Button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold glow-primary transition-all duration-300 hover:scale-[1.02]"
                >
                  Próximo Insight
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-8 h-8 text-[#7cba10]" />
                  <h2 className="text-3xl font-bold text-white">O Poder do Timing Cirúrgico</h2>
                </div>
                <p className="text-white/60 mb-8 font-mono text-sm">POR QUE AUTOMAÇÃO É CRUCIAL</p>

                <InsightCard icon={AlertCircle} title="A Janela de 5 Minutos">
                  Existe uma janela de ouro: entre 3 e 5 minutos após o abandono. É quando a dor da decisão ainda está
                  fresca, o desejo ainda está ativo, mas a objeção já foi racionalizada. Nesse momento, uma mensagem bem
                  calibrada tem o poder de reverter o abandono.
                </InsightCard>

                <InsightCard icon={Sparkles} title="O Que Não Funciona Mais">
                  E-mail de carrinho abandonado? Taxa de abertura de 15%. WhatsApp manual depois de horas? O lead já
                  esqueceu. <strong className="text-[#7cba10]">Você precisa agir em escala real-time</strong>, com
                  mensagens contextuais que atingem o lead no momento certo.
                </InsightCard>

                <Button
                  onClick={nextStep}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold glow-primary transition-all duration-300 hover:scale-[1.02]"
                >
                  Ver Solução
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-[#7cba10]/30 p-8 glow-primary-strong">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#7cba10] to-[#00ffc8] rounded-2xl flex items-center justify-center mb-6 glow-primary-strong">
                      <Zap className="w-10 h-10 text-[#0a0f0b]" strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white mb-3 gradient-text">Recupere Seu Dinheiro Invisível</h2>
                  <p className="text-white/70 font-mono text-sm">RECEBA SUA ANÁLISE PERSONALIZADA</p>
                </div>

                <div className="bg-[#0d1b0e] rounded-xl p-6 mb-6 border border-[#7cba10]/20">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 bg-[#142415] rounded-lg border border-[#7cba10]/30">
                      <p className="text-white/60 text-sm mb-1 font-mono">PERDA MENSAL</p>
                      <p className="text-2xl font-bold text-[#ff3b5c]">{formatCurrency(calculations.monthlyLoss)}</p>
                    </div>
                    <div className="text-center p-4 bg-[#142415] rounded-lg border border-[#7cba10]/30">
                      <p className="text-white/60 text-sm mb-1 font-mono">POTENCIAL DE RECUPERAÇÃO</p>
                      <p className="text-2xl font-bold text-[#7cba10]">{formatCurrency(recoveredRevenue)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block font-semibold">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block font-semibold">
                      E-mail Profissional
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp" className="text-white mb-2 block font-semibold">
                      WhatsApp (com DDD)
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="bg-[#113313] border-[#375e36] text-white placeholder:text-white/20 focus:border-[#7cba10] focus:ring-[#7cba10]/50 transition-all"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleFinalSubmit}
                  className="w-full mt-8 bg-gradient-to-r from-[#7cba10] to-[#00ffc8] hover:from-[#6aa80e] hover:to-[#00e6b4] text-[#0a0f0b] font-bold text-lg py-6 glow-primary-strong transition-all duration-300 hover:scale-[1.02]"
                  disabled={!formData.name || !formData.email || !formData.whatsapp || isSubmitting}
                >
                  {isSubmitting ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Receber Análise Completa
                    </>
                  )}
                </Button>

                <p className="text-center text-white/40 text-sm mt-4 font-mono">100% GRATUITO • SEM COMPROMISSO</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
