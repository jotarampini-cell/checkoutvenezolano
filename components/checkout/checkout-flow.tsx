'use client'

import { useState } from 'react'
import { LocalDelivery } from './delivery-modes/local-delivery'
import { NationalShipping } from './delivery-modes/national-shipping'
import { PickupDelivery } from './delivery-modes/pickup-delivery'
import { Truck, Package, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutFlowProps {
  onComplete: (data: any) => void
}

export function CheckoutFlow({ onComplete }: CheckoutFlowProps) {
  const [selectedMode, setSelectedMode] = useState<'local' | 'national' | 'pickup' | null>(null)

  return (
    <div className="space-y-4">
      {/* Local Delivery Card */}
      <div className={cn(
        'card-interactive overflow-hidden',
        selectedMode === 'local' && 'selected'
      )}>
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
        
        <div 
          className="accordion-content"
          data-state={selectedMode === 'local' ? 'open' : 'closed'}
        >
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-border mt-1">
            <div className="pt-4">
              <LocalDelivery onComplete={onComplete} />
            </div>
          </div>
        </div>
      </div>

      {/* National Shipping Card */}
      <div className={cn(
        'card-interactive overflow-hidden',
        selectedMode === 'national' && 'selected'
      )}>
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
        
        <div 
          className="accordion-content"
          data-state={selectedMode === 'national' ? 'open' : 'closed'}
        >
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-border mt-1">
            <div className="pt-4">
              <NationalShipping onComplete={onComplete} />
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Delivery Card */}
      <div className={cn(
        'card-interactive overflow-hidden',
        selectedMode === 'pickup' && 'selected'
      )}>
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
        
        <div 
          className="accordion-content"
          data-state={selectedMode === 'pickup' ? 'open' : 'closed'}
        >
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-border mt-1">
            <div className="pt-4">
              <PickupDelivery onComplete={onComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
