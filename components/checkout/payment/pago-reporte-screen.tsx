'use client'

import { useState } from 'react'
import { Lock, ImagePlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoReporteScreenProps {
  metodo: string
  numeroPedido: string
  monto: { bs?: number; usd?: number }
  onReportComplete: (data: any) => void
  onBackClick: () => void
}

const BANCOS = [
  'Banco de Venezuela',
  'Banesco',
  'Mercantil',
  'BBVA Provincial',
  'Bancaribe',
  'BOD',
  'Banco Exterior',
  'Banco Nacional de Crédito (BNC)',
  'Bicentenario',
  'Mi Banco',
  'Otro',
]

interface FormErrors {
  referencia?: string
  banco?: string
  fecha?: string
}

export function PagoReporteScreen({
  metodo,
  numeroPedido,
  monto,
  onReportComplete,
  onBackClick,
}: PagoReporteScreenProps) {
  const [formData, setFormData] = useState({
    referencia: '',
    banco: '',
    fecha: new Date().toISOString().slice(0, 16),
    archivo: null as File | null,
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, archivo: 'Archivo muy grande (máx. 5MB)' }))
        return
      }
      setFormData((prev) => ({ ...prev, archivo: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, archivo: null }))
    setPreview(null)
  }

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors }

    if (name === 'referencia') {
      if (!value) {
        newErrors.referencia = 'Ingresa el número de referencia'
      } else if (value.length < 6) {
        newErrors.referencia = 'Mínimo 6 caracteres'
      } else if (!/^\d+$/.test(value)) {
        newErrors.referencia = 'Solo números'
      } else {
        delete newErrors.referencia
      }
    }

    if (name === 'banco') {
      if ((metodo === 'pago-movil' || metodo === 'transferencia') && !value) {
        newErrors.banco = 'Selecciona un banco'
      } else {
        delete newErrors.banco
      }
    }

    if (name === 'fecha') {
      if (!value) {
        newErrors.fecha = 'Ingresa la fecha y hora'
      } else if (new Date(value) > new Date()) {
        newErrors.fecha = 'La fecha no puede ser en el futuro'
      } else {
        delete newErrors.fecha
      }
    }

    setErrors(newErrors)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.referencia) {
      newErrors.referencia = 'Ingresa el número de referencia'
    } else if (formData.referencia.length < 6) {
      newErrors.referencia = 'Mínimo 6 caracteres'
    } else if (!/^\d+$/.test(formData.referencia)) {
      newErrors.referencia = 'Solo números'
    }

    if ((metodo === 'pago-movil' || metodo === 'transferencia') && !formData.banco) {
      newErrors.banco = 'Selecciona un banco'
    }

    if (!formData.fecha) {
      newErrors.fecha = 'Ingresa la fecha y hora'
    } else if (new Date(formData.fecha) > new Date()) {
      newErrors.fecha = 'La fecha no puede ser en el futuro'
    }

    setErrors(newErrors)
    setTouched({
      referencia: true,
      banco: true,
      fecha: true,
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onReportComplete({
      referencia: formData.referencia,
      banco: formData.banco,
      fecha: formData.fecha,
      archivo: formData.archivo,
    })
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
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Reporta tu pago</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
            Completa estos datos para que podamos verificar tu pago rápidamente
          </p>
        </div>
      </div>

      {/* Order Reminder */}
      <div className="rounded-lg bg-muted px-2.5 py-1.5 text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
        Pedido <span className="font-mono font-bold text-foreground">{numeroPedido}</span> · Bs.{' '}
        {new Intl.NumberFormat('es-VE').format(monto.bs || 0)}
      </div>

      {/* Form */}
      <div className="space-y-3 sm:space-y-4">
        {/* Reference Number */}
        <div>
          <label htmlFor="referencia" className="block text-xs font-medium text-foreground mb-1 sm:text-sm">
            Número de referencia *
          </label>
          <input
            id="referencia"
            name="referencia"
            type="text"
            inputMode="numeric"
            placeholder="009876543210"
            value={formData.referencia}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              'w-full rounded-lg border px-2.5 py-1.5 text-sm text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary sm:px-3 sm:py-2',
              touched.referencia && errors.referencia ? 'border-red-500' : 'border-border'
            )}
          />
          {touched.referencia && errors.referencia && (
            <p className="mt-0.5 text-xs text-red-500">{errors.referencia}</p>
          )}
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1">
            El número que te dio tu banco
          </p>
        </div>

        {/* Bank Selection - Only for pago-movil and transferencia */}
        {(metodo === 'pago-movil' || metodo === 'transferencia') && (
          <div>
            <label htmlFor="banco" className="block text-xs font-medium text-foreground mb-1 sm:text-sm">
              Banco desde donde pagaste *
            </label>
            <select
              id="banco"
              name="banco"
              value={formData.banco}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'w-full rounded-lg border px-2.5 py-1.5 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary sm:px-3 sm:py-2',
                touched.banco && errors.banco ? 'border-red-500' : 'border-border'
              )}
            >
              <option value="">Selecciona un banco...</option>
              {BANCOS.map((banco) => (
                <option key={banco} value={banco}>
                  {banco}
                </option>
              ))}
            </select>
            {touched.banco && errors.banco && (
              <p className="mt-0.5 text-xs text-red-500">{errors.banco}</p>
            )}
          </div>
        )}

        {/* Date and Time */}
        <div>
          <label htmlFor="fecha" className="block text-xs font-medium text-foreground mb-1 sm:text-sm">
            Fecha y hora de la operación *
          </label>
          <input
            id="fecha"
            name="fecha"
            type="datetime-local"
            value={formData.fecha}
            onChange={handleChange}
            onBlur={handleBlur}
            max={new Date().toISOString().slice(0, 16)}
            className={cn(
              'w-full rounded-lg border px-2.5 py-1.5 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary sm:px-3 sm:py-2',
              touched.fecha && errors.fecha ? 'border-red-500' : 'border-border'
            )}
          />
          {touched.fecha && errors.fecha && (
            <p className="mt-0.5 text-xs text-red-500">{errors.fecha}</p>
          )}
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1">La fecha que aparece en tu comprobante</p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5 sm:text-sm sm:mb-2">
            Comprobante (opcional)
          </label>
          {!preview ? (
            <label className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition sm:p-6">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <ImagePlus className="h-6 w-6 mx-auto text-muted-foreground mb-1.5 sm:h-8 sm:w-8 sm:mb-2" />
              <p className="text-xs font-medium text-foreground sm:text-sm">
                Toca para subir una foto
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG · Máx. 5MB</p>
            </label>
          ) : (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted border border-border sm:gap-3 sm:p-3">
              <img src={preview} alt="Preview" className="h-10 w-10 rounded object-cover flex-shrink-0 sm:h-12 sm:w-12" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate sm:text-sm">
                  {formData.archivo?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((formData.archivo?.size || 0) / 1024).toFixed(0)}KB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 hover:bg-background rounded transition flex-shrink-0"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="flex gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 sm:p-3">
        <Lock className="h-4 w-4 flex-shrink-0 text-blue-600 mt-0.5" />
        <p className="text-xs text-blue-900">
          Tu información es confidencial y solo se usa para verificar tu pago.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full min-h-10 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed sm:min-h-12 sm:py-3"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent sm:h-4 sm:w-4" />
            Enviando...
          </span>
        ) : (
          'Enviar reporte de pago'
        )}
      </button>

      {/* Back Link */}
      <button
        onClick={onBackClick}
        className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5 sm:text-sm sm:py-2"
      >
        Volver a las instrucciones de pago
      </button>
    </div>
  )
}
