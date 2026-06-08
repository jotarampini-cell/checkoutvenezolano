'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'
import { ProfileSelection } from '@/components/checkout/profile-selection'
import { OrderSummary } from '@/components/checkout/order-summary'
import { ConfirmationModal } from '@/components/checkout/confirmation-modal'
import { CheckoutPaymentFlow } from '@/components/checkout/payment/checkout-payment-flow'
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  Shield,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'entrega' | 'datos' | 'pago' | 'confirmacion'

const STEPS: { key: Step; label: string }[] = [
  { key: 'entrega', label: 'Entrega' },
  { key: 'datos', label: 'Datos' },
  { key: 'pago', label: 'Pago' },
  { key: 'confirmacion', label: 'Listo' },
]

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('entrega')
  const [deliveryData, setDeliveryData] = useState<any>(null)
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const currentStepIndex = STEPS.findIndex((s) => s.key === step)

  // Calculate subtotal and total
  const subtotal = 1500000
  const shippingCost = deliveryData?.shippingCost || 0
  const total = subtotal + shippingCost

  const formatPrice = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`
    return `$${amount}`
  }

  // Step handlers
  const handleDeliveryComplete = useCallback((data: any) => {
    setDeliveryData(data)
    setStep('datos')
  }, [])

  const handleCustomerInfoComplete = useCallback((info: any) => {
    setCustomerInfo(info)
    setStep('pago')
  }, [])

  const handlePaymentComplete = useCallback((paymentData: any) => {
    const confirmNum = 'VE' + Date.now().toString().slice(-8)
    setConfirmationNumber(confirmNum)
    setOrderData({
      ...deliveryData,
      customerInfo,
      ...paymentData,
      confirmationNumber: confirmNum,
    })
    setStep('confirmacion')
  }, [deliveryData, customerInfo])

  const handleReset = useCallback(() => {
    setStep('entrega')
    setDeliveryData(null)
    setCustomerInfo(null)
    setOrderData(null)
    setConfirmationNumber(null)
  }, [])

  const handleBack = useCallback(() => {
    if (step === 'datos') setStep('entrega')
    else if (step === 'pago') setStep('datos')
  }, [step])

  return (
    <div className="min-h-dvh bg-background">
      {/* ========== STICKY HEADER ========== */}
      {step !== 'confirmacion' && (
        <header className={cn('checkout-header', scrolled && 'scrolled')}>
          <div className="mx-auto max-w-6xl px-4 py-3">
            {/* Top row: Logo + Total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <ShoppingBag className="h-[18px] w-[18px] text-primary" />
                </div>
                <span className="text-[15px] font-bold text-foreground tracking-tight">
                  Checkout
                </span>
              </div>

              {/* Collapsible total */}
              <button
                onClick={() => setSummaryExpanded(!summaryExpanded)}
                className="flex items-center gap-2 rounded-xl bg-secondary/80 px-3.5 py-2 transition-all hover:bg-secondary"
              >
                <div className="text-right">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {formatPrice(total)}
                  </div>
                </div>
                {summaryExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Expanded summary (mobile) */}
            {summaryExpanded && (
              <div className="mt-3 animate-fade-down lg:hidden">
                <div className="rounded-xl bg-secondary/60 p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Producto 1 × 2</span>
                    <span className="font-medium">{formatPrice(600000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Producto 2 × 1</span>
                    <span className="font-medium">{formatPrice(900000)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="font-medium">{formatPrice(shippingCost)}</span>
                    </div>
                  )}
                  <div className="divider" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="mt-4 mb-1">
              <div className="progress-bar">
                {/* Background line */}
                {/* Active line */}
                <div
                  className="progress-line"
                  style={{
                    width:
                      currentStepIndex === 0
                        ? '0%'
                        : currentStepIndex === 1
                          ? '33%'
                          : currentStepIndex === 2
                            ? '66%'
                            : '100%',
                  }}
                />

                {STEPS.map((s, i) => (
                  <div key={s.key} className="progress-step">
                    <div
                      className={cn(
                        'progress-dot',
                        i < currentStepIndex && 'completed',
                        i === currentStepIndex && 'active',
                        i > currentStepIndex && 'pending'
                      )}
                    >
                      {i < currentStepIndex ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'progress-label',
                        i < currentStepIndex && 'completed',
                        i === currentStepIndex && 'active'
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <main className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
        <div className={cn(
          'grid gap-6 lg:gap-8',
          step !== 'confirmacion' ? 'lg:grid-cols-[1fr_340px]' : ''
        )}>
          {/* Checkout flow area */}
          <div className={cn(
            'mx-auto w-full',
            step !== 'confirmacion' ? 'max-w-xl' : 'max-w-lg'
          )}>
            {/* Back button */}
            {step !== 'entrega' && step !== 'confirmacion' && (
              <button onClick={handleBack} className="btn-ghost mb-4 -ml-2 animate-fade-in">
                <ArrowLeft className="h-4 w-4" />
                <span>Atrás</span>
              </button>
            )}

            {/* Step title */}
            {step !== 'confirmacion' && (
              <div className="mb-6 step-enter">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {step === 'entrega' && '¿Cómo recibes tu pedido?'}
                  {step === 'datos' && 'Tus datos'}
                  {step === 'pago' && 'Método de pago'}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {step === 'entrega' && 'Elige la modalidad y completa los detalles de entrega'}
                  {step === 'datos' && 'Completa tu información para continuar'}
                  {step === 'pago' && 'Selecciona cómo deseas pagar'}
                </p>
              </div>
            )}

            {/* Step content */}
            <div className="step-content pb-28 lg:pb-8">
              {step === 'entrega' && (
                <CheckoutFlow onComplete={handleDeliveryComplete} />
              )}
              {step === 'datos' && (
                <ProfileSelection
                  onComplete={handleCustomerInfoComplete}
                  onBack={handleBack}
                />
              )}
              {step === 'pago' && (
                <CheckoutPaymentFlow
                  onComplete={handlePaymentComplete}
                  onBack={handleBack}
                />
              )}
              {step === 'confirmacion' && confirmationNumber && (
                <ConfirmationModal
                  orderData={orderData}
                  confirmationNumber={confirmationNumber}
                  onNewOrder={handleReset}
                />
              )}
            </div>
          </div>

          {/* Desktop sidebar */}
          {step !== 'confirmacion' && (
            <div className="hidden lg:block">
              <OrderSummary
                orderData={{
                  ...deliveryData,
                  customerInfo,
                  shippingCost,
                }}
                currentStep={step}
              />
            </div>
          )}
        </div>
      </main>

      {/* ========== STICKY CTA BOTTOM (mobile only) ========== */}
      {step !== 'confirmacion' && (
        <div className="sticky-cta">
          <div className="mx-auto max-w-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
              <Lock className="h-3.5 w-3.5" />
              <span>Seguro</span>
            </div>
            <div className="flex-1 text-right">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Total
              </div>
              <div className="text-base font-bold text-foreground leading-tight">
                {formatPrice(total)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
