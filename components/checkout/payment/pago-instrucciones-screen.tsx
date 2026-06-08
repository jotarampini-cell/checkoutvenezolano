'use client'

import { Info, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface PagoInstruccionesScreenProps {
  methodId: string
}

export function PagoInstruccionesScreen({ methodId }: PagoInstruccionesScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Mock data depending on methodId
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
      <div className="card-premium p-4 sm:p-5 bg-muted/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-foreground">Por favor ten el efectivo exacto al momento de recibir tu pedido. Nuestro repartidor no maneja cambio.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-premium p-4 sm:p-6 space-y-4 bg-muted/10">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Instrucciones de pago</h3>
      </div>
      <div className="space-y-3">
        {instructions.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-xs">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{item.value}</p>
            </div>
            <button 
              onClick={() => handleCopy(item.value, item.label)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
            >
              {copiedField === item.label ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center pt-2">Realiza el pago y reporta los datos a continuación.</p>
    </div>
  )
}
