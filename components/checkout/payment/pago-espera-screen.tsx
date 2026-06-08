'use client'

import { ShieldCheck } from 'lucide-react'

export function PagoEsperaScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-card border-[3px] border-primary shadow-glow">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Procesando pago</h2>
      <p className="text-sm text-muted-foreground mb-8 max-w-[280px]">
        Estamos verificando tu transacción de forma segura. Esto tomará solo unos segundos.
      </p>
      <div className="spinner h-8 w-8 text-primary" />
    </div>
  )
}
