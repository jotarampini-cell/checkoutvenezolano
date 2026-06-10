'use client'

import { useState, useEffect } from 'react'
import { LocalDelivery } from './delivery-modes/local-delivery'
import { NationalShipping } from './delivery-modes/national-shipping'
import { PickupDelivery } from './delivery-modes/pickup-delivery'
import { Truck, Package, Store, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DeliveryMode = 'local' | 'national' | 'pickup'

interface CheckoutFlowProps {
  onComplete: (data: any) => void
  availableModes?: DeliveryMode[]
}

export function CheckoutFlow({ onComplete, availableModes = ['local', 'national', 'pickup'] }: CheckoutFlowProps) {
  // Step 1: select mode, Step 2: fill form
  const [internalStep, setInternalStep] = useState<'select' | 'form'>(
    availableModes.length === 1 ? 'form' : 'select'
  )
  const [selectedMode, setSelectedMode] = useState<DeliveryMode | null>(
    availableModes.length === 1 ? availableModes[0] : null
  )

  useEffect(() => {
    if (availableModes.length === 1 && selectedMode !== availableModes[0]) {
      setSelectedMode(availableModes[0])
      setInternalStep('form')
    }
  }, [availableModes, selectedMode])

  const handleSelectMode = (mode: DeliveryMode) => {
    setSelectedMode(mode)
    setInternalStep('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToModes = () => {
    setInternalStep('select')
    setSelectedMode(null)
  }

  if (internalStep === 'form' && selectedMode) {
    return (
      <div className="animate-fade-in">
        {/* Only show back button if there are other options to go back to */}
        {availableModes.length > 1 && (
          <button onClick={handleBackToModes} className="btn-ghost mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Cambiar método de entrega</span>
          </button>
        )}

        <div className="card-premium p-4 sm:p-6 mb-6 bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              {selectedMode === 'local' && <Truck className="h-6 w-6" />}
              {selectedMode === 'national' && <Package className="h-6 w-6" />}
              {selectedMode === 'pickup' && <Store className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {selectedMode === 'local' && 'Delivery Local'}
                {selectedMode === 'national' && 'Envío Nacional'}
                {selectedMode === 'pickup' && 'Retiro en Tienda'}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {selectedMode === 'local' && 'Completa los detalles de tu entrega'}
                {selectedMode === 'national' && 'Completa los detalles de tu envío'}
                {selectedMode === 'pickup' && 'Selecciona la sede de retiro'}
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-up">
          {selectedMode === 'local' && <LocalDelivery onComplete={onComplete} />}
          {selectedMode === 'national' && <NationalShipping onComplete={onComplete} />}
          {selectedMode === 'pickup' && <PickupDelivery onComplete={onComplete} />}
        </div>
      </div>
    )
  }

  // Selection Screen
  return (
    <div className="space-y-4 animate-fade-in">
      {availableModes.includes('local') && (
        <div 
          className="card-interactive p-4 sm:p-5 flex items-center gap-4"
          onClick={() => handleSelectMode('local')}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Truck className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Delivery Local</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Entrega a domicilio en tu zona</p>
          </div>
        </div>
      )}

      {availableModes.includes('national') && (
        <div 
          className="card-interactive p-4 sm:p-5 flex items-center gap-4"
          onClick={() => handleSelectMode('national')}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Envío Nacional</h3>
            <p className="text-sm text-muted-foreground mt-0.5">A través de transportista en todo el país</p>
          </div>
        </div>
      )}

      {availableModes.includes('pickup') && (
        <div 
          className="card-interactive p-4 sm:p-5 flex items-center gap-4"
          onClick={() => handleSelectMode('pickup')}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Store className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-foreground">Retiro en Tienda</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Recoge tu pedido en nuestras sedes</p>
          </div>
        </div>
      )}

      {/* Fallback button if user clicks sticky Continuar while on this screen */}
      <button 
        id="submit-step-btn" 
        className="hidden" 
        onClick={() => {
          // If they click the global continue without selecting a card
          alert("Por favor selecciona un método de entrega")
        }} 
      />
    </div>
  )
}
