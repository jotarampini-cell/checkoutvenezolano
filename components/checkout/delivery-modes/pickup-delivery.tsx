'use client'

import { useState } from 'react'
import { StoreSelector } from '../store-selector'
import { PaymentOptionSelector } from '../payment-option-selector'

interface PickupDeliveryProps {
  step: number
  onStepChange: (step: number) => void
  onComplete: (data: any) => void
}

export function PickupDelivery({ step, onStepChange, onComplete }: PickupDeliveryProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string | null>(null)

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store)
    onStepChange(2)
  }

  const handlePaymentOptionSelect = (option: string) => {
    setSelectedPaymentOption(option)
  }

  const handleConfirm = () => {
    if (selectedPaymentOption) {
      onComplete({
        mode: 'pickup',
        store: selectedStore,
        paymentOption: selectedPaymentOption,
        shippingCost: 0,
        eta: 'Hoy (al retiro)',
        pickupCode: 'PICKUP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      })
    }
  }

  return (
    <div className="space-y-6">
      {step >= 1 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-lg font-bold text-foreground">Elige tu sede</h3>
          </div>
          {step === 1 ? (
            <StoreSelector onSelect={handleStoreSelect} />
          ) : (
            <div className="rounded bg-muted p-3 text-sm text-foreground">
              ✓ Sede: <span className="font-bold">{selectedStore}</span>
            </div>
          )}
        </div>
      )}

      {step >= 2 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </div>
            <h3 className="text-lg font-bold text-foreground">Selecciona opción de pago</h3>
          </div>
          <div className="space-y-3">
            <PaymentOptionSelector
              onSelect={handlePaymentOptionSelect}
              selected={selectedPaymentOption}
            />

            {step === 2 && selectedPaymentOption && (
              <div className="rounded bg-muted p-3">
                <div className="text-sm font-medium text-foreground">Resumen de retiro:</div>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div>• Sede: {selectedStore}</div>
                  <div>• Pago: {selectedPaymentOption === 'online' ? 'Anticipado (Online)' : 'En tienda'}</div>
                  <div className="font-bold text-foreground">• Costo de envío: Gratis</div>
                  <div>• Retiro inmediato (al confirmar)</div>
                </div>
              </div>
            )}

            {step === 2 && selectedPaymentOption && (
              <button
                onClick={handleConfirm}
                className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90"
              >
                Continuar al Pago
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
