'use client'

import { useState, useRef } from 'react'
import { FileText, UploadCloud, Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoReporteScreenProps {
  methodId: string
  onSubmit: (data: any) => void
}

export function PagoReporteScreen({ methodId, onSubmit }: PagoReporteScreenProps) {
  const [ref, setRef] = useState('')
  const todayStr = new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
  const [date, setDate] = useState(todayStr)
  const [capture, setCapture] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (methodId === 'divisas') {
    return (
      <button onClick={() => onSubmit({ type: 'cash' })} className="btn-primary">
        Confirmar Pedido
      </button>
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCapture(e.target.files[0])
    }
  }

  return (
    <div className="space-y-5">
      <div className="card-premium p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Reportar pago</h3>
        </div>

        <div className="space-y-4">
          
          {/* Subir Capture (Required) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Comprobante de pago <span className="text-destructive">*</span></label>
            <div 
              onClick={() => !capture && fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center gap-2",
                capture 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-muted cursor-pointer"
              )}
            >
              {capture ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <span className="text-sm font-bold text-foreground truncate block">{capture.name}</span>
                      <span className="text-xs text-muted-foreground">{(capture.size / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setCapture(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Toca para subir tu capture</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Formatos: JPG, PNG, PDF</p>
                  </div>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,.pdf"
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Número de Referencia (Opcional)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 123456"
              className={cn("input-premium", ref && "has-value")}
              value={ref}
              onChange={(e) => setRef(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Fecha del pago</label>
            <input
              type="date"
              placeholder=" "
              className={cn("input-premium", date && "has-value")}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onSubmit({ ref, date, capture })}
          disabled={!capture || !date}
          className="btn-primary w-full sm:w-auto px-10"
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  )
}
