'use client'

import { useState } from 'react'
import { CheckoutPaymentFlow } from '@/components/checkout/payment/checkout-payment-flow'

export default function DemoPaymentPage() {
  const [completed, setCompleted] = useState(false)

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm rounded-lg border border-border bg-card p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">¡Pago completado!</h1>
          <p className="text-muted-foreground">El flujo de pago se ejecutó correctamente</p>
          <button
            onClick={() => setCompleted(false)}
            className="w-full rounded-lg bg-primary py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Flow */}
          <div className="lg:col-span-2">
            <CheckoutPaymentFlow
              onComplete={() => setCompleted(true)}
              onBack={() => console.log('Back clicked')}
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <h2 className="text-lg font-bold text-foreground">Demo - Flujo de Pago</h2>
              <p className="text-sm text-muted-foreground space-y-2">
                <span className="block">Pantalla 1: Selecciona un método de pago</span>
                <span className="block">Pantalla 2: Instrucciones y contador regresivo</span>
                <span className="block">Pantalla 3: Reporte del pago</span>
                <span className="block">Pantalla 4: Verificación en espera</span>
              </p>

              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">DATOS MOCK:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>Pedido: <span className="font-mono">VE82500681</span></li>
                  <li>Monto: <span className="font-mono">Bs. 1.600.000</span></li>
                  <li>Teléfono: <span className="font-mono">0414-123-4567</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
