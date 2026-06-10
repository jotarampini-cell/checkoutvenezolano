'use client'

import { ShieldCheck, Wifi, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'Datos recibidos', icon: ShieldCheck },
  { label: 'Verificando transacción', icon: Wifi },
  { label: 'Confirmando orden', icon: CheckCircle2 },
]

export function PagoEsperaScreen() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 800),
      setTimeout(() => setActiveStep(2), 1800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      {/* Animated shield icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-card border-[3px] border-primary shadow-glow">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Procesando pago</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">
        Estamos verificando tu transacción de forma segura.
      </p>

      {/* 3-step progress */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done = i < activeStep
          const active = i === activeStep
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500",
                done && "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
                active && "bg-primary/5 border-primary/20",
                !done && !active && "bg-muted/30 border-border opacity-40"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                done && "bg-emerald-500 text-white",
                active && "bg-primary text-primary-foreground",
                !done && !active && "bg-muted text-muted-foreground"
              )}>
                {done
                  ? <CheckCircle2 className="h-4 w-4" />
                  : active
                    ? <div className="spinner h-4 w-4" />
                    : <Icon className="h-4 w-4" />
                }
              </div>
              <span className={cn(
                "text-sm font-semibold transition-colors duration-500",
                done && "text-emerald-700 dark:text-emerald-400",
                active && "text-foreground",
                !done && !active && "text-muted-foreground"
              )}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">Esto tomará solo unos segundos...</p>
    </div>
  )
}
