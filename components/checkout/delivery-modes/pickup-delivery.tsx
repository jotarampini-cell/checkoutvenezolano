'use client'

import { useState, useRef } from 'react'
import { StoreSelector } from '../store-selector'
import { Store, CreditCard, Wallet, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PickupDeliveryProps {
  onComplete: (data: any) => void
}

export function PickupDelivery({ onComplete }: PickupDeliveryProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [paymentOption, setPaymentOption] = useState<'online' | 'store' | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const paymentSectionRef = useRef<HTMLDivElement>(null)
  const summarySectionRef = useRef<HTMLDivElement>(null)

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store)
    // Auto-scroll to payment options
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const handlePaymentOptionSelect = (option: 'online' | 'store') => {
    setPaymentOption(option)
    setTimeout(() => {
      summarySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }

  const handleConfirm = () => {
    if (!selectedStore || !paymentOption) {
      setShowErrors(true)
      const firstError = document.querySelector('.error-highlight')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onComplete({
      mode: 'pickup',
      store: selectedStore,
      paymentOption,
      pickupCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      shippingCost: 0,
      eta: 'Inmediato',
    })
  }

  return (
    <div className="space-y-6">
      <div className={cn("space-y-3 p-3 rounded-xl transition-all", showErrors && !selectedStore && "bg-destructive/5 ring-1 ring-destructive error-highlight")}>
        <label className={cn("text-sm font-semibold flex items-center gap-2", showErrors && !selectedStore ? "text-destructive" : "text-foreground")}>
          {selectedStore ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold", showErrors && !selectedStore ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary")}>1</div>
          )}
          Selecciona la tienda
        </label>
        <StoreSelector onSelect={handleStoreSelect} selected={selectedStore} />
        {showErrors && !selectedStore && (
          <p className="text-xs font-medium text-destructive mt-1 animate-fade-in">Falta seleccionar la tienda de retiro</p>
        )}
      </div>

      <div
        ref={paymentSectionRef}
        className={cn("transition-all duration-500 scroll-mt-4", selectedStore ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[0.5]")}
      >
        <div className={cn("space-y-3 p-3 rounded-xl transition-all", showErrors && selectedStore && !paymentOption && "bg-destructive/5 ring-1 ring-destructive error-highlight")}>
          <label className={cn("text-sm font-semibold flex items-center gap-2", showErrors && selectedStore && !paymentOption ? "text-destructive" : "text-foreground")}>
            {paymentOption ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold", showErrors && selectedStore && !paymentOption ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary")}>2</div>
            )}
            ¿Cómo deseas pagar?
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div 
              onClick={() => handlePaymentOptionSelect('online')}
              className={cn(
                "card-interactive p-4 flex gap-3",
                paymentOption === 'online' && "selected"
              )}
            >
              <div className={cn("radio-indicator mt-0.5", paymentOption === 'online' && "selected")}>
                 <div className="radio-dot" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                  <CreditCard className="h-4 w-4" />
                  Pago Anticipado
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">Paga ahora online y solo retira tu pedido al llegar a la tienda.</p>
              </div>
            </div>

            <div 
              onClick={() => handlePaymentOptionSelect('store')}
              className={cn(
                "card-interactive p-4 flex gap-3",
                paymentOption === 'store' && "selected"
              )}
            >
              <div className={cn("radio-indicator mt-0.5", paymentOption === 'store' && "selected")}>
                 <div className="radio-dot" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                  <Wallet className="h-4 w-4" />
                  Pagar en Tienda
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">Reserva tu pedido y págalo al momento de retirarlo en físico.</p>
              </div>
            </div>
          </div>
          {showErrors && selectedStore && !paymentOption && (
            <p className="text-xs font-medium text-destructive mt-1 animate-fade-in">Falta seleccionar el método de pago</p>
          )}
        </div>
      </div>

      {selectedStore && paymentOption && (
        <div ref={summarySectionRef} className="animate-fade-up space-y-4 pt-4 border-t border-border mt-2 scroll-mt-4">
          <div className="rounded-xl bg-muted/50 p-4 space-y-3 border border-border">
            <div className="flex items-start gap-3">
              <Store className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tienda de Retiro</p>
                <p className="text-sm font-medium text-foreground mt-0.5 leading-snug">{selectedStore}</p>
                <p className="text-xs text-muted-foreground mt-1">Horario: Lunes a Sábado de 9am a 6pm</p>
              </div>
            </div>
            
            <div className="divider my-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Tiempo estimado:</span>
              </div>
              <span className="font-semibold text-foreground text-sm">Inmediato</span>
            </div>
          </div>
        </div>
      )}

      {/* This button is permanently in the DOM so the sticky "Continuar" button always finds it */}
      <button
        id="submit-step-btn"
        onClick={handleConfirm}
        className="hidden"
      >
        Continuar con este retiro
      </button>
    </div>
  )
}
