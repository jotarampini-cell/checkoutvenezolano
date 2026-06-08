'use client'

import { useState } from 'react'
import { Smartphone, Building2, DollarSign, Banknote, ChevronDown, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoMetodoScreenProps {
  onMetodoSelect: (metodo: string) => void
  onBack?: () => void
}

const PAYMENT_METHODS = [
  {
    id: 'pago-movil',
    name: 'Pago Móvil',
    description: 'Banco a banco por teléfono',
    icon: Smartphone,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    colorSelected: 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'transferencia',
    name: 'Transferencia bancaria',
    description: 'A cuenta corriente o de ahorro',
    icon: Building2,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    colorSelected: 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20',
    iconColor: 'text-blue-600',
  },
  {
    id: 'zelle',
    name: 'Zelle',
    description: 'Transferencia en dólares',
    icon: DollarSign,
    color: 'text-violet-700 bg-violet-50 border-violet-200',
    colorSelected: 'border-violet-600 bg-violet-50/60 ring-2 ring-violet-600/20',
    iconColor: 'text-violet-600',
  },
  {
    id: 'divisas',
    name: 'Divisas en efectivo',
    description: 'Entrega de USD/EUR al recibir',
    icon: Banknote,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    colorSelected: 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20',
    iconColor: 'text-amber-600',
  },
]

export function PagoMetodoScreen({ onMetodoSelect, onBack }: PagoMetodoScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isOrderExpanded, setIsOrderExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleContinue = async () => {
    if (!selectedMethod) return

    setLoading(true)
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onMetodoSelect(selectedMethod)
  }

  return (
    <div className="mx-auto max-w-sm space-y-4 pb-8 sm:space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1 flex-1">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition sm:h-2',
                  step === 5 ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">5/6</span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Selecciona cómo vas a pagar</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Elige tu método de pago preferido</p>
        </div>
      </div>

      {/* Order Summary - Collapsible */}
      <div className="rounded-lg border border-border bg-card">
        <button
          onClick={() => setIsOrderExpanded(!isOrderExpanded)}
          className="flex w-full items-center justify-between p-3 hover:bg-muted/50 transition sm:p-4"
        >
          <div className="text-left">
            <p className="text-xs font-medium text-muted-foreground">TOTAL</p>
            <p className="text-base font-bold text-foreground sm:text-lg">Bs. 1.6M</p>
          </div>
          <ChevronDown
            className={cn('h-4 w-4 text-muted-foreground transition sm:h-5 sm:w-5', isOrderExpanded && 'rotate-180')}
          />
        </button>

        {isOrderExpanded && (
          <div className="border-t border-border px-3 py-2 space-y-2 sm:px-4 sm:py-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Producto</span>
              <span className="text-foreground">Bs. 1.5M</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span className="text-foreground">Bs. 100k</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-xs sm:text-sm">
              <span className="text-foreground">Total</span>
              <span className="text-primary">Bs. 1.6M</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="space-y-2 sm:space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id

          return (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150 active:scale-[0.98]',
                isSelected
                  ? method.colorSelected
                  : 'border-border bg-card hover:bg-secondary/60'
              )}
            >
              <div className={cn('p-2.5 rounded-lg border', method.color)}>
                <Icon className={cn('h-5 w-5', method.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{method.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
              </div>
              <div
                className={cn(
                  'h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-border bg-background'
                )}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Info Banner */}
      <div className="flex gap-2 rounded-lg bg-yellow-50 p-2.5 border border-yellow-200 sm:gap-3 sm:p-3">
        <Clock className="h-4 w-4 flex-shrink-0 text-yellow-700 mt-0.5 sm:h-5 sm:w-5" />
        <p className="text-xs text-yellow-800">Tu pedido queda reservado mientras realizas el pago.</p>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!selectedMethod || loading}
        className={cn(
          'w-full py-4 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-150',
          'active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed',
          selectedMethod
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Procesando...
          </span>
        ) : selectedMethod ? (
          `Continuar con ${PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name}`
        ) : (
          'Selecciona un método para continuar'
        )}
      </button>
    </div>
  )
}
