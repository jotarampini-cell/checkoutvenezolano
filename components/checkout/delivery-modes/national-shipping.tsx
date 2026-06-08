'use client'

import { useState } from 'react'
import { TransportSelector } from '../transport-selector'
import { LocationCascade } from '../location-cascade'
import { Package, MapPin, Building2, Clock, Truck, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NationalShippingProps {
  onComplete: (data: any) => void
}

export function NationalShipping({ onComplete }: NationalShippingProps) {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<{state: string; city: string; branch: string} | null>(null)
  const [cost, setCost] = useState<number | null>(null)

  const handleTransportSelect = (transport: string) => {
    setSelectedTransport(transport)
  }

  const handleLocationSelect = (state: string, city: string, branch: string) => {
    setLocationData({ state, city, branch })
    setCost(0) // Cobro a destino
  }

  const handleConfirm = () => {
    if (!locationData || !selectedTransport) return
    onComplete({
      mode: 'national',
      transport: selectedTransport,
      state: locationData.state,
      city: locationData.city,
      branch: locationData.branch,
      shippingCost: cost,
      eta: '3-5 días hábiles',
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {selectedTransport ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">1</div>
          )}
          Elige empresa de transporte
        </label>
        <TransportSelector onSelect={handleTransportSelect} selected={selectedTransport} />
      </div>

      <div className={cn("transition-all duration-500", selectedTransport ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[0.5]")}>
        <div className="space-y-3 pt-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            {locationData ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">2</div>
            )}
            Destino del envío
          </label>
          <LocationCascade onSelect={handleLocationSelect} transport={selectedTransport} />
        </div>
      </div>

      {locationData && cost !== null && selectedTransport && (
        <div className="animate-fade-up space-y-4 pt-4 border-t border-border mt-2">
          <div className="rounded-xl bg-muted/50 p-4 space-y-3 border border-border">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Detalles de envío por {selectedTransport}</p>
                <p className="text-sm font-medium text-foreground mt-0.5 leading-snug">{locationData.state} → {locationData.city}</p>
                <p className="text-xs text-muted-foreground mt-1">Sucursal: {locationData.branch}</p>
              </div>
            </div>
            
            <div className="divider my-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Tiempo estimado:</span>
              </div>
              <span className="font-semibold text-foreground text-sm">3-5 días hábiles</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Modalidad de envío:</span>
              </div>
              <span className="font-bold text-primary text-sm">Cobro a destino</span>
            </div>
          </div>

          <button
            id="submit-step-btn"
            onClick={handleConfirm}
            className="hidden"
          >
            Continuar con este envío
          </button>
        </div>
      )}
    </div>
  )
}
