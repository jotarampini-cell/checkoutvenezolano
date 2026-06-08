'use client'

import { useState } from 'react'
import { ProfileSelection } from './profile-selection'
import { LocalDelivery } from './delivery-modes/local-delivery'
import { NationalShipping } from './delivery-modes/national-shipping'
import { PickupDelivery } from './delivery-modes/pickup-delivery'

interface CheckoutFlowProps {
  mode: 'local' | 'national' | 'pickup'
  onComplete: (data: any) => void
  onBack: () => void
}

interface CustomerInfo {
  fullName: string
  cedula: string
  phoneNumber: string
  email: string
}

export function CheckoutFlow({ mode, onComplete, onBack }: CheckoutFlowProps) {
  const [step, setStep] = useState<number>(1)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const totalSteps = mode === 'pickup' ? 3 : 4

  const handleCustomerInfoComplete = (info: CustomerInfo) => {
    setCustomerInfo(info)
    setStep(2)
  }

  const handleDeliveryComplete = (deliveryData: any) => {
    onComplete({
      customerInfo,
      deliveryData,
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Atrás
        </button>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs font-medium text-muted-foreground">
            Paso {step} de {totalSteps}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-12 rounded-full transition ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Profile Selection / Customer Information */}
      {step === 1 && (
        <ProfileSelection
          onComplete={handleCustomerInfoComplete}
          onBack={onBack}
        />
      )}

      {/* Steps 2+: Delivery Mode Component */}
      {step >= 2 && (
        <>
          {mode === 'local' && (
            <LocalDelivery
              step={step - 1}
              onStepChange={(newStep) => setStep(newStep + 1)}
              onComplete={handleDeliveryComplete}
            />
          )}
          {mode === 'national' && (
            <NationalShipping
              step={step - 1}
              onStepChange={(newStep) => setStep(newStep + 1)}
              onComplete={handleDeliveryComplete}
            />
          )}
          {mode === 'pickup' && (
            <PickupDelivery
              step={step - 1}
              onStepChange={(newStep) => setStep(newStep + 1)}
              onComplete={handleDeliveryComplete}
            />
          )}
        </>
      )}
    </div>
  )
}
