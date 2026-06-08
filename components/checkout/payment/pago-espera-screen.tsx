'use client'

import { useEffect, useState } from 'react'
import { Clock, Copy, Check, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoEsperaScreenProps {
  numeroPedido: string
  metodo: string
  onNuevoPedido: () => void
  onIrInicio: () => void
}

export function PagoEsperaScreen({
  numeroPedido,
  metodo,
  onNuevoPedido,
  onIrInicio,
}: PagoEsperaScreenProps) {
  const [fadeIn, setFadeIn] = useState(false)
  const [copiedNumber, setCopiedNumber] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(numeroPedido)
    setCopiedNumber(true)
    setTimeout(() => setCopiedNumber(false), 2000)
  }

  const getTiempoEstimado = () => {
    switch (metodo) {
      case 'pago-movil':
        return '2 a 4 horas en días hábiles'
      case 'transferencia':
        return '2 a 4 horas en días hábiles'
      case 'zelle':
        return '1 a 2 horas en días hábiles'
      case 'divisas':
        return 'Al momento de la entrega'
      default:
        return '2 a 4 horas'
    }
  }

  return (
    <div
      className={cn(
        'mx-auto max-w-sm space-y-4 pb-8 transition-opacity duration-500 sm:space-y-6',
        fadeIn ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Icon and Title */}
      <div className="flex flex-col items-center text-center pt-3 sm:pt-6">
        <div className="relative mb-3 sm:mb-4">
          <Clock className="h-12 w-12 text-amber-500 animate-pulse sm:h-16 sm:w-16" />
        </div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Pago en verificación</h1>
        <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
          Recibimos tu reporte. Estamos verificando el pago.
        </p>
      </div>

      {/* Order Number Card */}
      <div className="rounded-lg border-2 border-primary bg-card p-4 text-center space-y-2 sm:p-6 sm:space-y-3">
        <p className="text-xs font-medium text-muted-foreground">NÚMERO DE PEDIDO</p>
        <p className="font-mono text-2xl font-bold text-foreground sm:text-3xl break-all">{numeroPedido}</p>
        <button
          onClick={handleCopyNumber}
          className="mx-auto flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition sm:px-3 sm:text-sm"
        >
          {copiedNumber ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4" />
              <span className="text-green-600">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Copiar
            </>
          )}
        </button>
      </div>

      {/* Status Timeline */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">Estado de tu pedido</h3>
        <div className="space-y-3 sm:space-y-4">
          {/* Step 1: Completado */}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 sm:h-8 sm:w-8">
                <CheckCircle className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
              </div>
              <div className="w-0.5 h-10 bg-border mt-0.5 sm:h-12 sm:mt-1" />
            </div>
            <div className="pb-3 sm:pb-4">
              <p className="text-xs font-semibold text-green-700 sm:text-sm">Pedido creado</p>
              <p className="text-xs text-muted-foreground">Stock reservado</p>
            </div>
          </div>

          {/* Step 2: En progreso */}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 animate-pulse sm:h-8 sm:w-8">
                <Clock className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
              </div>
              <div className="w-0.5 h-10 bg-border mt-0.5 sm:h-12 sm:mt-1" />
            </div>
            <div className="pb-3 sm:pb-4">
              <p className="text-xs font-semibold text-amber-700 sm:text-sm">Pago reportado</p>
              <p className="text-xs text-muted-foreground">Verificando</p>
            </div>
          </div>

          {/* Step 3: Pendiente */}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted bg-background sm:h-8 sm:w-8">
                <div className="h-1.5 w-1.5 rounded-full bg-muted" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground sm:text-sm">Pago confirmado</p>
              <p className="text-xs text-muted-foreground">Pedido en preparación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Estimate */}
      <div className="rounded-lg bg-card border border-border p-3 space-y-1.5 sm:p-4 sm:space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          <p className="text-xs font-medium text-foreground sm:text-sm">Tiempo de confirmación</p>
        </div>
        <p className="text-xs font-semibold text-primary sm:text-sm">{getTiempoEstimado()}</p>
        <p className="text-xs text-muted-foreground">
          Te notificaremos por WhatsApp cuando confirmemos.
        </p>
      </div>

      {/* WhatsApp Notification Mock */}
      <div className="rounded-lg bg-green-50 border border-green-200 p-3 space-y-2 sm:p-4 sm:space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          <p className="text-xs font-semibold text-green-900 sm:text-sm">Notificaciones en WhatsApp</p>
        </div>

        <div className="space-y-2 bg-white rounded-lg p-2 text-xs sm:p-3 sm:text-sm">
          {/* Sent message - user side */}
          <div className="flex justify-end">
            <div className="bg-green-100 text-green-900 rounded-2xl rounded-tr-sm px-2.5 py-1.5 max-w-xs sm:px-3 sm:py-2">
              Tu reporte de pago fue recibido. Pedido: {numeroPedido}
            </div>
          </div>

          {/* Future message - bot side */}
          <div className="flex justify-start mt-2 sm:mt-3">
            <div className="bg-gray-200 text-gray-600 rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-xs italic sm:px-3 sm:py-2">
              ✓ Pago confirmado. Tu pedido está en preparación.
              <p className="text-xs mt-0.5">Próximamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Link */}
      <button
        onClick={() => console.log('[v0] Abriendo seguimiento de pedido:', numeroPedido)}
        className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5 sm:text-sm sm:py-2"
      >
        Seguir estado del pedido →
      </button>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 sm:space-y-3 sm:pt-4">
        <button
          onClick={onNuevoPedido}
          className="w-full min-h-10 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 sm:min-h-12 sm:py-3"
        >
          Hacer otro pedido
        </button>

        <button
          onClick={onIrInicio}
          className="w-full min-h-10 rounded-lg border-2 border-border bg-background py-2.5 text-sm font-bold text-foreground transition hover:bg-muted sm:min-h-12 sm:py-3"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  )
}
