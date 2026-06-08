'use client'

import { useState } from 'react'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'
import { OrderSummary } from '@/components/checkout/order-summary'
import { ConfirmationModal } from '@/components/checkout/confirmation-modal'
import { CheckoutPaymentFlow } from '@/components/checkout/payment/checkout-payment-flow'

export default function CheckoutPage() {
  const [step, setStep] = useState<'delivery-mode' | 'delivery-details' | 'payment' | 'confirmation'>('delivery-mode')
  const [deliveryMode, setDeliveryMode] = useState<'local' | 'national' | 'pickup' | null>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)

  const handleModeSelect = (mode: 'local' | 'national' | 'pickup') => {
    setDeliveryMode(mode)
    setStep('delivery-details')
  }

  const handleDeliveryDetailsComplete = (data: any) => {
    setOrderData(data)
    setStep('payment')
  }

  const handlePaymentComplete = (paymentData: any) => {
    // Generate confirmation number
    const confirmNum = 'VE' + Date.now().toString().slice(-8)
    setConfirmationNumber(confirmNum)
    setOrderData({ ...orderData, ...paymentData, confirmationNumber: confirmNum })
    setStep('confirmation')
  }

  const handleReset = () => {
    setStep('delivery-mode')
    setDeliveryMode(null)
    setOrderData(null)
    setConfirmationNumber(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 border-b border-border pb-4 sm:mb-8 sm:pb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Checkout Venezolano</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:mt-2">Completa tu pedido de forma segura y rápida</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-4 sm:gap-8 lg:grid-cols-3">
          {/* Checkout Flow */}
          <div className="lg:col-span-2">
            {step === 'delivery-mode' && (
              <DeliveryModeSelector onModeSelect={handleModeSelect} />
            )}
            {step === 'delivery-details' && deliveryMode && (
              <CheckoutFlow
                mode={deliveryMode}
                onComplete={handleDeliveryDetailsComplete}
                onBack={() => setStep('delivery-mode')}
              />
            )}
            {step === 'payment' && (
              <CheckoutPaymentFlow
                onComplete={handlePaymentComplete}
                onBack={() => setStep('delivery-details')}
              />
            )}
            {step === 'confirmation' && confirmationNumber && (
              <ConfirmationModal
                orderData={orderData}
                confirmationNumber={confirmationNumber}
                onNewOrder={handleReset}
              />
            )}
          </div>

          {/* Order Summary */}
          {step !== 'confirmation' && (
            <div className="lg:col-span-1">
              <OrderSummary orderData={orderData} currentStep={step} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DeliveryModeSelector({ onModeSelect }: { onModeSelect: (mode: 'local' | 'national' | 'pickup') => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Elige tu modalidad de entrega</h2>
        <p className="mt-2 text-muted-foreground">Selecciona cómo deseas recibir tu pedido</p>
      </div>

      <div className="space-y-4">
        <DeliveryModeCard
          title="Delivery Local"
          description="Entrega a domicilio en tu zona"
          details={['Ubicación con Google Maps', 'Costo dinámico por zona', 'Confirmación por WhatsApp']}
          onClick={() => onModeSelect('local')}
          icon="🚚"
        />

        <DeliveryModeCard
          title="Envío Nacional"
          description="Envío a través de transportista"
          details={['MRW, Zoom, Tealca', 'Selección de sucursal', 'Seguimiento incluido']}
          onClick={() => onModeSelect('national')}
          icon="📦"
        />

        <DeliveryModeCard
          title="Retiro en Tienda"
          description="Recoge tu pedido en nuestras sedes"
          details={['Horarios de atención', 'Código de retiro', 'Pago anticipado o en tienda']}
          onClick={() => onModeSelect('pickup')}
          icon="🏪"
        />
      </div>
    </div>
  )
}

function DeliveryModeCard({
  title,
  description,
  details,
  onClick,
  icon,
}: {
  title: string
  description: string
  details: string[]
  onClick: () => void
  icon: string
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-card p-6 text-left transition hover:border-primary hover:bg-accent hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          <ul className="mt-3 space-y-1">
            {details.map((detail, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                ✓ {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  )
}


