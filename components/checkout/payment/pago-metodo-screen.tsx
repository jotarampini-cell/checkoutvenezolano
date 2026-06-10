'use client'

import { Smartphone, Building2, DollarSign, Banknote, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoMetodoScreenProps {
  onSelect: (method: string) => void
  selected?: string | null
  currency?: 'USD' | 'VES'
  setCurrency?: (c: 'USD' | 'VES') => void
}

const PAYMENT_METHODS = [
  { id: 'pago-movil', name: 'Pago Móvil', description: 'Banco a banco por teléfono', icon: Smartphone, currency: 'VES' },
  { id: 'transferencia', name: 'Transferencia bancaria', description: 'A cuenta corriente o de ahorro', icon: Building2, currency: 'VES' },
  { id: 'zelle', name: 'Zelle', description: 'Transferencia en dólares', icon: DollarSign, currency: 'USD' },
  { id: 'divisas', name: 'Divisas en efectivo', description: 'Entrega de USD/EUR al recibir', icon: Banknote, currency: 'USD' },
]

export function PagoMetodoScreen({ onSelect, selected, currency = 'USD', setCurrency }: PagoMetodoScreenProps) {
  const availableMethods = PAYMENT_METHODS.filter(
    m => m.currency === 'both' || m.currency === currency || (!m.currency)
  )

  return (
    <div className="space-y-4">
      {/* Inline Currency Toggle */}
      <div className="bg-muted/50 p-1.5 rounded-xl flex items-center mb-6">
        <button
          onClick={() => setCurrency?.('USD')}
          className={cn(
            "flex-1 text-sm font-bold py-2 rounded-lg transition-all",
            currency === 'USD' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted"
          )}
        >
          USD $
        </button>
        <button
          onClick={() => setCurrency?.('VES')}
          className={cn(
            "flex-1 text-sm font-bold py-2 rounded-lg transition-all",
            currency === 'VES' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted"
          )}
        >
          VES
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {availableMethods.map((method) => {
          const Icon = method.icon
          const isSelected = selected === method.id

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                "card-interactive p-4 flex gap-3",
                isSelected && "selected"
              )}
            >
              <div className={cn("radio-indicator mt-1", isSelected && "selected")}>
                 <div className="radio-dot" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-lg bg-muted transition-colors", isSelected && "bg-primary text-primary-foreground")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-bold text-sm text-foreground">{method.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{method.description}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center pt-2">
        <div className="trust-badge animate-fade-in">
          <Shield className="h-3.5 w-3.5" />
          Pago 100% seguro y verificado
        </div>
      </div>
    </div>
  )
}
