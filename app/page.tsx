'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'
import { ProfileSelection } from '@/components/checkout/profile-selection'
import { OrderSummary } from '@/components/checkout/order-summary'
import { ConfirmationModal } from '@/components/checkout/confirmation-modal'
import { CheckoutPaymentFlow } from '@/components/checkout/payment/checkout-payment-flow'
import { ShoppingBag, ChevronDown, ChevronUp, Check, ArrowLeft, Shield, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CartItemList, CartItem, INITIAL_CART } from '@/components/checkout/cart-item-list'

type Step = 'entrega' | 'datos' | 'pago' | 'confirmacion'

const STEPS: { key: Step; label: string }[] = [
  { key: 'entrega', label: 'Entrega' },
  { key: 'datos', label: 'Datos' },
  { key: 'pago', label: 'Pago' },
  { key: 'confirmacion', label: 'Listo' },
]

export const EXCHANGE_RATE = 567.68
export type Currency = 'USD' | 'VES'

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('entrega')
  const [stepDirection, setStepDirection] = useState<'forward' | 'back'>('forward')
  const [stepKey, setStepKey] = useState(0) // forces re-mount for animation replay
  const [deliveryData, setDeliveryData] = useState<any>(null)
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Global currency state
  const [currency, setCurrency] = useState<Currency>('USD')

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART)

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

  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = Math.max(0, item.quantity + delta)
        return { ...item, quantity: newQ }
      }
      return item
    }).filter(item => item.quantity > 0))
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }, [])

  // Calculate subtotal and total
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = deliveryData?.shippingCost || 0
  const total = subtotal + shippingCost

  const formatPrice = useCallback((amountInUsd: number) => {
    if (currency === 'VES') {
      const amountInVes = amountInUsd * EXCHANGE_RATE
      return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInVes)
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amountInUsd)
  }, [currency])

  // Step navigation helper
  const goToStep = useCallback((next: Step, direction: 'forward' | 'back') => {
    setStepDirection(direction)
    setStepKey(k => k + 1)
    setStep(next)
  }, [])

  // Step handlers
  const handleDeliveryComplete = useCallback((data: any) => {
    setDeliveryData(data)
    goToStep('datos', 'forward')
  }, [goToStep])

  const handleCustomerInfoComplete = useCallback((info: any) => {
    setCustomerInfo(info)
    goToStep('pago', 'forward')
  }, [goToStep])

  const handlePaymentComplete = useCallback((paymentData: any) => {
    const confirmNum = 'VE' + Date.now().toString().slice(-8)
    setConfirmationNumber(confirmNum)
    setOrderData({
      ...deliveryData,
      customerInfo,
      ...paymentData,
      confirmationNumber: confirmNum,
    })
    goToStep('confirmacion', 'forward')
  }, [deliveryData, customerInfo, goToStep])

  const handleReset = useCallback(() => {
    setStepDirection('forward')
    setStepKey(k => k + 1)
    setStep('entrega')
    setDeliveryData(null)
    setCustomerInfo(null)
    setOrderData(null)
    setConfirmationNumber(null)
  }, [])

  const handleBack = useCallback(() => {
    if (step === 'datos') goToStep('entrega', 'back')
    else if (step === 'pago') goToStep('datos', 'back')
  }, [step, goToStep])

  return (
    <div className="min-h-dvh bg-background">
      {/* ========== SIMPLE STICKY HEADER ========== */}
      {step !== 'confirmacion' && (
        <header className={cn('checkout-header', scrolled && 'scrolled')}>
          <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Checkout
              </h1>

              {/* Collapsible total (Mobile only) */}
              <button
                onClick={() => setSummaryExpanded(!summaryExpanded)}
                className="flex lg:hidden items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5 transition-all hover:bg-muted"
              >
                <div className="text-right">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Total
                  </div>
                  <div className="text-sm font-bold text-foreground leading-none mt-0.5">
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
              <div className="mt-4 animate-fade-down lg:hidden">
                <div className="rounded-xl bg-card border border-border p-4 shadow-lg space-y-4">
                  {/* Currency Toggle Mobile */}
                  <div className="bg-muted/50 p-1.5 rounded-lg flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setCurrency('USD')}
                        className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-colors", currency === 'USD' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
                      >
                        USD $
                      </button>
                      <button 
                        onClick={() => setCurrency('VES')}
                        className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-colors", currency === 'VES' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
                      >
                        VES
                      </button>
                    </div>
                    {currency === 'VES' && (
                      <p className="text-[10px] text-muted-foreground text-center font-medium">
                        Tasa BCV: {EXCHANGE_RATE.toLocaleString('es-VE')} Bs. / $1
                      </p>
                    )}
                  </div>

                  {/* Products List */}
                  <CartItemList 
                    items={cartItems} 
                    onUpdateQuantity={handleUpdateQuantity} 
                    onRemoveItem={handleRemoveItem} 
                    formatPrice={formatPrice}
                  />

                  <div className="divider !my-2" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    {shippingCost > 0 ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="font-medium">{formatPrice(shippingCost)}</span>
                      </div>
                    ) : (deliveryData?.mode === 'national' ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="font-medium">Cobro a destino</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="text-xs font-medium text-muted-foreground">Por calcular</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-border mt-2">
                      <span>Total a pagar</span>
                      <span className="text-foreground">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Minimalist Progress Indicator */}
            <div className="mt-4 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex-1 flex flex-col gap-1.5">
                  <div 
                    className={cn(
                      "h-1.5 w-full rounded-full transition-colors",
                      i <= currentStepIndex ? "bg-foreground" : "bg-muted"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
              ))}
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
            {cartItems.length === 0 && (
              <div className="card-premium p-6 text-center text-muted-foreground animate-fade-in mb-6 border-destructive/20 bg-destructive/5">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-20 text-destructive" />
                <p className="font-bold text-foreground">Tu carrito está vacío</p>
                <p className="text-sm mt-1">Agrega al menos un producto para continuar con tu orden.</p>
              </div>
            )}

            <div key={stepKey} className={cn(
              "step-content pb-28 lg:pb-8",
              stepDirection === 'forward' ? 'step-enter-forward' : 'step-enter-back',
              cartItems.length === 0 && "opacity-40 pointer-events-none grayscale-[0.5]"
            )}>
              {step === 'pago' && (
                <CheckoutPaymentFlow 
                  onComplete={handlePaymentComplete} 
                  onBack={() => goToStep('datos', 'back')} 
                  currency={currency}
                  setCurrency={setCurrency}
                  total={total}
                  formatPrice={formatPrice}
                />
              )}
              {step === 'datos' && (
                <ProfileSelection
                  onComplete={handleCustomerInfoComplete}
                  onBack={handleBack}
                />
              )}
              {step === 'entrega' && (
                <CheckoutFlow onComplete={handleDeliveryComplete} />
              )}
              {step === 'confirmacion' && confirmationNumber && (
                <ConfirmationModal
                  orderData={orderData}
                  confirmationNumber={confirmationNumber}
                  totalFormatted={formatPrice(total)}
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
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                currency={currency}
                onCurrencyChange={setCurrency}
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={total}
                showContinueButton={step !== 'pago' && cartItems.length > 0}
              />
            </div>
          )}
        </div>
      </main>
      {/* Floating Bottom Bar for Mobile */}
      {step !== 'confirmacion' && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/85 backdrop-blur-md border-t border-border lg:hidden z-40 animate-fade-up shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] text-foreground/60 font-bold uppercase tracking-widest">Total a pagar</p>
              <p className="text-lg font-extrabold text-foreground leading-none mt-0.5 tabular-nums truncate">{formatPrice(total)}</p>
            </div>
            <button 
              onClick={() => {
                const btn = document.getElementById('submit-step-btn');
                if (btn) btn.click();
              }}
              disabled={cartItems.length === 0 || step === 'pago'}
              className={cn("btn-primary shrink-0 !w-[120px] !flex-none py-2 px-4 text-sm rounded-lg", step === 'pago' ? "opacity-0 pointer-events-none" : "opacity-100")}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
