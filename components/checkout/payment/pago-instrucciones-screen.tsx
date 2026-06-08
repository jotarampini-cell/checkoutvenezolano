'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PagoInstruccionesScreenProps {
  metodo: string
  numeroPedido: string
  monto: { bs?: number; usd?: number }
  tasaBCV: number
  telefonoPagoMovil?: string
  bancoPagoMovil?: string
  cedulaReceptor?: string
  nombreTitular?: string
  cuentaTransferencia?: string
  emailZelle?: string
  onReportClick: () => void
  onBackClick: () => void
}

interface CountdownState {
  minutes: number
  seconds: number
  isExpired: boolean
}

export function PagoInstruccionesScreen({
  metodo,
  numeroPedido,
  monto,
  tasaBCV,
  telefonoPagoMovil,
  bancoPagoMovil,
  cedulaReceptor,
  nombreTitular,
  cuentaTransferencia,
  emailZelle,
  onReportClick,
  onBackClick,
}: PagoInstruccionesScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<CountdownState>({
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  // Setup countdown timer
  useEffect(() => {
    let totalSeconds = 0
    if (metodo === 'pago-movil' || metodo === 'transferencia') {
      totalSeconds = 2 * 60 * 60 // 2 hours
    } else if (metodo === 'zelle') {
      totalSeconds = 4 * 60 * 60 // 4 hours
    } else if (metodo === 'divisas') {
      return // No countdown for divisas
    }

    const interval = setInterval(() => {
      totalSeconds--
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60

      if (totalSeconds <= 0) {
        setCountdown({ minutes: 0, seconds: 0, isExpired: true })
        clearInterval(interval)
      } else {
        setCountdown({
          minutes,
          seconds,
          isExpired: false,
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [metodo])

  const handleCopy = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const renderPaymentData = () => {
    switch (metodo) {
      case 'pago-movil':
        return (
          <div className="space-y-3">
            <CopyableField
              label="Teléfono destino"
              value={telefonoPagoMovil || ''}
              fieldId="phone"
              isCopied={copiedField === 'phone'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Banco destino"
              value={bancoPagoMovil || ''}
              fieldId="banco"
              isCopied={copiedField === 'banco'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Cédula del receptor"
              value={cedulaReceptor || ''}
              fieldId="cedula"
              isCopied={copiedField === 'cedula'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Nombre (titular)"
              value={nombreTitular || ''}
              fieldId="nombre"
              isCopied={copiedField === 'nombre'}
              onCopy={handleCopy}
            />
          </div>
        )

      case 'transferencia':
        return (
          <div className="space-y-3">
            <CopyableField
              label="Banco"
              value={bancoPagoMovil || ''}
              fieldId="banco"
              isCopied={copiedField === 'banco'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Tipo de cuenta"
              value="Corriente"
              fieldId="tipo-cuenta"
              isCopied={copiedField === 'tipo-cuenta'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Número de cuenta"
              value={cuentaTransferencia || ''}
              fieldId="cuenta"
              isCopied={copiedField === 'cuenta'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Titular"
              value="Empresa S.A."
              fieldId="titular"
              isCopied={copiedField === 'titular'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="RIF"
              value="J-12345678-9"
              fieldId="rif"
              isCopied={copiedField === 'rif'}
              onCopy={handleCopy}
            />
          </div>
        )

      case 'zelle':
        return (
          <div className="space-y-3">
            <CopyableField
              label="Email Zelle"
              value={emailZelle || ''}
              fieldId="email"
              isCopied={copiedField === 'email'}
              onCopy={handleCopy}
            />
            <CopyableField
              label="Nombre del titular"
              value="John Doe"
              fieldId="zelle-nombre"
              isCopied={copiedField === 'zelle-nombre'}
              onCopy={handleCopy}
            />
          </div>
        )

      case 'divisas':
        return (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center space-y-2">
            <p className="font-semibold text-foreground">Pagarás en efectivo al recibir tu pedido.</p>
            <p className="text-sm text-muted-foreground">
              Ten listo el monto exacto. Nuestro equipo confirmará el pago al momento de la entrega.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  const getMonto = () => {
    if (metodo === 'zelle' || metodo === 'divisas') {
      return `$${monto.usd?.toFixed(2)}`
    }
    return `Bs. ${new Intl.NumberFormat('es-VE').format(monto.bs || 0)}`
  }

  const getInstruccion2 = () => {
    switch (metodo) {
      case 'pago-movil':
        return 'Ve a Pago Móvil e ingresa el teléfono destino'
      case 'transferencia':
        return 'Haz una transferencia a la cuenta indicada'
      case 'zelle':
        return 'Abre Zelle y envía al email indicado'
      case 'divisas':
        return 'Prepara el monto exacto para la entrega'
      default:
        return ''
    }
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
          <div className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 mb-1.5 sm:px-3 sm:py-1 sm:mb-2">
            <p className="text-xs font-semibold text-blue-900">
              {metodo === 'pago-movil' && 'Pago Móvil'}
              {metodo === 'transferencia' && 'Transferencia Bancaria'}
              {metodo === 'zelle' && 'Zelle'}
              {metodo === 'divisas' && 'Divisas'}
            </p>
          </div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Realiza tu pago ahora</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
            Sigue los pasos y luego repórtanos el pago
          </p>
        </div>
      </div>

      {/* Countdown Timer - Only show for non-divisas methods */}
      {(metodo === 'pago-movil' || metodo === 'transferencia' || metodo === 'zelle') && (
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border',
          countdown.isExpired
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
        )}>
          <div className={cn(
            'p-2 rounded-lg',
            countdown.isExpired ? 'bg-red-100' : 'bg-amber-100'
          )}>
            <Clock className={cn(
              'h-4 w-4',
              countdown.isExpired ? 'text-red-600' : 'text-amber-700'
            )} />
          </div>
          <div className="flex-1">
            <p className={cn(
              'text-xs font-medium',
              countdown.isExpired ? 'text-red-700' : 'text-amber-800'
            )}>
              Tu reserva expira en
            </p>
            <p className={cn(
              'text-lg font-bold tabular-nums leading-tight',
              countdown.isExpired ? 'text-red-600' : 'text-amber-700'
            )}>
              {countdown.minutes.toString().padStart(2, '0')}:
              {countdown.seconds.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      )}

      {/* Payment Data Card */}
      <div className="rounded-lg bg-card border border-border p-3 space-y-2 sm:p-4 sm:space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Datos para realizar el pago</h3>
        {renderPaymentData()}
      </div>

      {/* Amount Card */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
          Monto exacto a pagar
        </p>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold text-foreground tabular-nums leading-none">
              {getMonto()}
            </p>
            {(metodo === 'pago-movil' || metodo === 'transferencia') && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Tasa BCV: Bs. {tasaBCV} / USD
              </p>
            )}
          </div>
          <button
            onClick={() => handleCopy(getMonto(), 'monto')}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border hover:border-primary/40 hover:text-primary transition-all"
          >
            {copiedField === 'monto' ? (
              <><Check className="h-3 w-3 inline mr-1" /> Copiado</>
            ) : (
              <><Copy className="h-3 w-3 inline mr-1" /> Copiar</>
            )}
          </button>
        </div>
      </div>

      {/* Concepto/Referencia */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2.5 mb-3">
          <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800">
              Escribe esto en el campo "concepto"
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Tu banco te pedirá una descripción al transferir
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white/70 rounded-lg px-3 py-2.5 border border-amber-200">
          <span className="font-mono font-bold text-amber-900 text-base tracking-widest">
            {numeroPedido}
          </span>
          <button
            onClick={() => handleCopy(numeroPedido, 'concepto')}
            className="text-xs text-amber-700 font-medium ml-3 flex-shrink-0"
          >
            {copiedField === 'concepto' ? (
              <><Check className="h-3 w-3 inline mr-1" /> Copiado</>
            ) : (
              <><Copy className="h-3 w-3 inline mr-1" /> Copiar</>
            )}
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Pasos</h3>
        <ol className="space-y-2 sm:space-y-3">
          {[
            'Abre tu app bancaria o billetera',
            getInstruccion2(),
            'Escribe el código del pedido en el campo concepto',
            'Vuelve aquí y repórtanos el pago',
          ].map((step, index) => (
            <li key={index} className="flex gap-2 sm:gap-3">
              <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-primary text-white text-xs font-bold sm:h-8 sm:w-8 sm:text-sm">
                {index + 1}
              </span>
              <span className="text-xs text-foreground pt-0.5 sm:text-sm sm:pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Continue Button */}
      <button
        onClick={onReportClick}
        className="w-full py-4 rounded-2xl font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition-all duration-150"
      >
        Ya realicé el pago — reportar ahora
      </button>

      {/* Back Link */}
      <button
        onClick={onBackClick}
        className="w-full text-center text-xs font-medium text-primary hover:underline py-1.5 sm:text-sm sm:py-2"
      >
        Cambiar método de pago
      </button>
    </div>
  )
}

function CopyableField({
  label,
  value,
  fieldId,
  isCopied,
  onCopy,
}: {
  label: string
  value: string
  fieldId: string
  isCopied: boolean
  onCopy: (text: string, id: string) => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground font-mono truncate">{value}</p>
      </div>
      <button
        onClick={() => onCopy(value, fieldId)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex-shrink-0',
          isCopied
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'bg-secondary text-muted-foreground border border-border hover:border-primary/40 hover:text-primary'
        )}
      >
        {isCopied ? (
          <><Check className="h-3 w-3" /> Copiado</>
        ) : (
          <><Copy className="h-3 w-3" /> Copiar</>
        )}
      </button>
    </div>
  )
}
