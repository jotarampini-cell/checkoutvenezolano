'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoReporteScreenProps {
  methodId: string
  onSubmit: (data: any) => void
}

export function PagoReporteScreen({ methodId, onSubmit }: PagoReporteScreenProps) {
  const [ref, setRef] = useState('')
  const [date, setDate] = useState('')

  if (methodId === 'divisas') {
    return (
      <button onClick={() => onSubmit({ type: 'cash' })} className="btn-primary">
        Confirmar Pedido
      </button>
    )
  }

  return (
    <div className="space-y-5">
      <div className="card-premium p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Reportar pago</h3>
        </div>

        <div className="space-y-4">
          <div className="floating-label-group">
            <input
              type="text"
              inputMode="numeric"
              placeholder=" "
              className={cn("input-premium", ref && "has-value")}
              value={ref}
              onChange={(e) => setRef(e.target.value)}
            />
            <label>Número de Referencia</label>
          </div>

          <div className="floating-label-group">
            <input
              type="date"
              placeholder=" "
              className={cn("input-premium", date && "has-value")}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label>Fecha del pago</label>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSubmit({ ref, date })}
        disabled={!ref || !date}
        className="btn-primary"
      >
        Confirmar Pago
      </button>
    </div>
  )
}
