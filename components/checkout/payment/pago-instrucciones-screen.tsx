'use client'

import { Info, Copy, CheckCircle2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface PagoInstruccionesScreenProps {
  methodId: string
  total?: number
  formatPrice?: (amount: number) => string
}

export function PagoInstruccionesScreen({ methodId, total = 0, formatPrice }: PagoInstruccionesScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [tooltipField, setTooltipField] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll into view when instructions appear
  useEffect(() => {
    const timeout = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 150) // small delay lets animation start first
    return () => clearTimeout(timeout)
  }, [])

  const handleCopy = (text: string, field: string) => {
    // For the total amount, strip currency letters/symbols and copy just the number
    const valueToCopy = field === '__total'
      ? text.replace(/[^0-9.,]/g, '').trim()
      : text
    navigator.clipboard.writeText(valueToCopy)
    setCopiedField(field)
    setTooltipField(field)
    setTimeout(() => {
      setCopiedField(null)
      setTooltipField(null)
    }, 2000)
  }

  const getInstructions = () => {
    if (methodId === 'pago-movil') {
      return [
        { label: 'Banco', value: 'Banesco (0134)' },
        { label: 'Teléfono', value: '0414-1234567' },
        { label: 'Cédula/RIF', value: 'J-12345678-9' }
      ]
    }
    if (methodId === 'transferencia') {
      return [
        { label: 'Banco', value: 'Mercantil' },
        { label: 'Cuenta', value: '0105-1234-56-1234567890' },
        { label: 'A nombre de', value: 'Empresa CA' }
      ]
    }
    if (methodId === 'zelle') {
      return [
        { label: 'Email Zelle', value: 'pagos@empresa.com' },
        { label: 'A nombre de', value: 'Empresa LLC' }
      ]
    }
    return null
  }

  const instructions = getInstructions()

  if (!instructions) {
    return (
      <div ref={containerRef} className="card-premium p-4 sm:p-5 bg-muted/30 animate-fade-up">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-foreground">Por favor ten el efectivo exacto al momento de recibir tu pedido. Nuestro repartidor no maneja cambio.</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="card-premium p-4 sm:p-6 space-y-4 bg-muted/10 animate-fade-up">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Instrucciones de pago</h3>
      </div>
      <div className="space-y-3">
        {/* Monto a pagar — always first and highlighted */}
        {total > 0 && formatPrice && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 shadow-xs">
            <div>
              <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Monto a pagar</p>
              <p className="text-base font-bold text-primary mt-0.5">{formatPrice(total)}</p>
            </div>
            <div className="relative">
              {tooltipField === '__total' && (
                <div className="absolute -top-9 right-0 bg-foreground text-background text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap animate-fade-down shadow-md">
                  ¡Copiado! ✓
                  <div className="absolute -bottom-1 right-3 w-2 h-2 bg-foreground rotate-45" />
                </div>
              )}
              <button
                onClick={() => handleCopy(formatPrice(total), '__total')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  copiedField === '__total'
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                    : "hover:bg-primary/10 text-primary"
                )}
              >
                {copiedField === '__total'
                  ? <CheckCircle2 className="h-4 w-4" />
                  : <Copy className="h-4 w-4" />
                }
              </button>
            </div>
          </div>
        )}

        {instructions.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-xs">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{item.value}</p>
            </div>
            <div className="relative">
              {/* Tooltip */}
              {tooltipField === item.label && (
                <div className="absolute -top-9 right-0 bg-foreground text-background text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap animate-fade-down shadow-md">
                  ¡Copiado! ✓
                  <div className="absolute -bottom-1 right-3 w-2 h-2 bg-foreground rotate-45" />
                </div>
              )}
              <button
                onClick={() => handleCopy(item.value, item.label)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  copiedField === item.label
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                {copiedField === item.label
                  ? <CheckCircle2 className="h-4 w-4" />
                  : <Copy className="h-4 w-4" />
                }
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center pt-2">Realiza el pago y reporta los datos a continuación.</p>
    </div>
  )
}
