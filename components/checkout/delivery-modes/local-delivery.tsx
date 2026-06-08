'use client'

import { useState } from 'react'
import { MapPicker } from '../map-picker'
import { ZoneSelector } from '../zone-selector'
import { MapPin, Navigation, Clock, DollarSign, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LocalDeliveryProps {
  onComplete: (data: any) => void
}

export function LocalDelivery({ onComplete }: LocalDeliveryProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [cost, setCost] = useState<number | null>(null)

  const getZoneCost = (zone: string | null) => {
    if (!zone) return null
    const low = ['Chacao', 'Altamira', 'Los Palos Grandes']
    const mid = ['El Rosal', 'Bello Monte', 'Las Mercedes', 'La Castellana']
    const high = ['La Florida', 'Los Ruices']
    
    if (low.includes(zone)) return 2
    if (mid.includes(zone)) return 4
    if (high.includes(zone)) return 5
    return 6 // Macaracuay and others
  }

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone)
    setCost(getZoneCost(zone))
  }

  const handleLocationSelect = (coords: { lat: number; lng: number; address: string }) => {
    setLocation(coords)
  }

  const handleConfirm = () => {
    onComplete({
      mode: 'local',
      zone: selectedZone,
      location,
      shippingCost: cost,
      eta: '30-45 minutos',
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {selectedZone ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">1</div>
          )}
          ¿En qué zona te encuentras?
        </label>
        <ZoneSelector onSelect={handleZoneSelect} selected={selectedZone} />
      </div>

      <div className={cn("transition-all duration-500", selectedZone ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[0.5]")}>
        <div className="space-y-3 pt-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            {location ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">2</div>
            )}
            Confirma tu ubicación exacta
          </label>
          <MapPicker onSelect={handleLocationSelect} />
        </div>
      </div>

      {location && cost !== null && (
        <div className="animate-fade-up space-y-4 pt-4 border-t border-border mt-2">
          <div className="rounded-xl bg-muted/50 p-4 space-y-3 border border-border">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Dirección de entrega</p>
                <p className="text-sm font-medium text-foreground mt-0.5 leading-snug">{location.address}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedZone}</p>
              </div>
            </div>
            
            <div className="divider my-2" />
            
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Costo de delivery</span>
              <span className="text-foreground">${cost}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Tiempo estimado:</span>
              </div>
              <span className="font-semibold text-foreground text-sm">30-45 min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Costo de delivery:</span>
              </div>
              <span className="font-bold text-primary text-sm">${cost.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="btn-primary"
          >
            Continuar con esta entrega
          </button>
        </div>
      )}
    </div>
  )
}
