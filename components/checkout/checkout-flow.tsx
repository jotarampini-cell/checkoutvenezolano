'use client'

import { useState, useEffect } from 'react'
import { LocalDelivery } from './delivery-modes/local-delivery'
import { NationalShipping } from './delivery-modes/national-shipping'
import { PickupDelivery } from './delivery-modes/pickup-delivery'
import { Truck, Package, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DeliveryMode = 'local' | 'national' | 'pickup'

interface CheckoutFlowProps {
  onComplete: (data: any) => void
  availableModes?: DeliveryMode[]
}

export function CheckoutFlow({ onComplete, availableModes = ['local', 'national', 'pickup'] }: CheckoutFlowProps) {
  // If there's only one available mode, pre-select it
  const [selectedMode, setSelectedMode] = useState<DeliveryMode | null>(
    availableModes.length === 1 ? availableModes[0] : null
  )

  useEffect(() => {
    if (availableModes.length === 1 && selectedMode !== availableModes[0]) {
      setSelectedMode(availableModes[0])
    }
  }, [availableModes, selectedMode])

  const hasLocal = availableModes.includes('local')
  const hasNational = availableModes.includes('national')
  const hasPickup = availableModes.includes('pickup')

  return (
    <div className="space-y-4">
      {/* Local Delivery Card */}
      {hasLocal && (
        <div className={cn(
          'card-interactive overflow-hidden',
          selectedMode === 'local' && 'selected',
          availableModes.length === 1 && '!cursor-default'
        )}>
          {availableModes.length > 1 && (
            <div 
              className="flex items-center gap-4 p-4 sm:p-5"
              onClick={() => setSelectedMode(selectedMode === 'local' ? null : 'local')}
            >
              <div className={cn("radio-indicator", selectedMode === 'local' && "selected")}>
                 <div className="radio-dot" />
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-foreground">Delivery Local</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Entrega a domicilio en tu zona</p>
              </div>
            </div>
          )}
          
          <div 
            className={cn("accordion-content", availableModes.length === 1 ? "!opacity-100 !max-h-none" : "")}
            data-state={selectedMode === 'local' ? 'open' : 'closed'}
          >
            <div className={cn("px-4 sm:px-5 pb-4 sm:pb-5", availableModes.length > 1 ? "pt-0 border-t border-border mt-1" : "pt-4 sm:pt-5")}>
              {availableModes.length === 1 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">Delivery Local</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Completa los detalles de tu entrega</p>
                  </div>
                </div>
              )}
              <div className={availableModes.length > 1 ? "pt-4" : ""}>
                <LocalDelivery onComplete={onComplete} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* National Shipping Card */}
      {hasNational && (
        <div className={cn(
          'card-interactive overflow-hidden',
          selectedMode === 'national' && 'selected',
          availableModes.length === 1 && '!cursor-default'
        )}>
          {availableModes.length > 1 && (
            <div 
              className="flex items-center gap-4 p-4 sm:p-5"
              onClick={() => setSelectedMode(selectedMode === 'national' ? null : 'national')}
            >
              <div className={cn("radio-indicator", selectedMode === 'national' && "selected")}>
                 <div className="radio-dot" />
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Package className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-foreground">Envío Nacional</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">A través de transportista en todo el país</p>
              </div>
            </div>
          )}
          
          <div 
            className={cn("accordion-content", availableModes.length === 1 ? "!opacity-100 !max-h-none" : "")}
            data-state={selectedMode === 'national' ? 'open' : 'closed'}
          >
            <div className={cn("px-4 sm:px-5 pb-4 sm:pb-5", availableModes.length > 1 ? "pt-0 border-t border-border mt-1" : "pt-4 sm:pt-5")}>
              {availableModes.length === 1 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">Envío Nacional</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Completa los detalles de tu envío</p>
                  </div>
                </div>
              )}
              <div className={availableModes.length > 1 ? "pt-4" : ""}>
                <NationalShipping onComplete={onComplete} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Delivery Card */}
      {hasPickup && (
        <div className={cn(
          'card-interactive overflow-hidden',
          selectedMode === 'pickup' && 'selected',
          availableModes.length === 1 && '!cursor-default'
        )}>
          {availableModes.length > 1 && (
            <div 
              className="flex items-center gap-4 p-4 sm:p-5"
              onClick={() => setSelectedMode(selectedMode === 'pickup' ? null : 'pickup')}
            >
              <div className={cn("radio-indicator", selectedMode === 'pickup' && "selected")}>
                 <div className="radio-dot" />
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Store className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-foreground">Retiro en Tienda</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Recoge tu pedido en nuestras sedes</p>
              </div>
            </div>
          )}
          
          <div 
            className={cn("accordion-content", availableModes.length === 1 ? "!opacity-100 !max-h-none" : "")}
            data-state={selectedMode === 'pickup' ? 'open' : 'closed'}
          >
            <div className={cn("px-4 sm:px-5 pb-4 sm:pb-5", availableModes.length > 1 ? "pt-0 border-t border-border mt-1" : "pt-4 sm:pt-5")}>
              {availableModes.length === 1 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Store className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">Retiro en Tienda</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Selecciona la sede de retiro</p>
                  </div>
                </div>
              )}
              <div className={availableModes.length > 1 ? "pt-4" : ""}>
                <PickupDelivery onComplete={onComplete} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
