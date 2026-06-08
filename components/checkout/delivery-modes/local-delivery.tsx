'use client'

import { useState } from 'react'
import { MapPicker } from '../map-picker'
import { ZoneSelector } from '../zone-selector'

interface LocalDeliveryProps {
  step: number
  onStepChange: (step: number) => void
  onComplete: (data: any) => void
}

export function LocalDelivery({ step, onStepChange, onComplete }: LocalDeliveryProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [cost, setCost] = useState<number>(0)

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone)
    onStepChange(2)
  }

  const handleLocationSelect = (coords: { lat: number; lng: number; address: string }) => {
    setLocation(coords)
    // Calculate cost based on zone
    const baseCost = 50000
    const costMultiplier = Math.floor(Math.random() * 2) + 1 // Random 50k or 100k
    setCost(baseCost * costMultiplier)
    onStepChange(3)
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
      {step >= 1 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-lg font-bold text-foreground">Selecciona tu zona de delivery</h3>
          </div>
          {step === 1 ? (
            <ZoneSelector onSelect={handleZoneSelect} />
          ) : (
            <div className="rounded bg-muted p-3 text-sm text-foreground">
              ✓ Zona seleccionada: <span className="font-bold">{selectedZone}</span>
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
            <h3 className="text-lg font-bold text-foreground">Ubica tu dirección en el mapa</h3>
          </div>
          {step === 2 ? (
            <MapPicker onSelect={handleLocationSelect} />
          ) : (
            <div className="space-y-2 rounded bg-muted p-3">
              <div className="text-sm text-foreground">
                ✓ Ubicación: <span className="font-bold">{location?.address}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Coordenadas: {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
              </div>
            </div>
          )}
        </div>
      )}

      {step >= 3 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              3
            </div>
            <h3 className="text-lg font-bold text-foreground">Confirma tu pedido</h3>
          </div>
          <div className="space-y-3">
            <div className="rounded bg-muted p-3">
              <div className="text-sm font-medium text-foreground">Resumen de entrega:</div>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div>• Zona: {selectedZone}</div>
                <div>• Dirección: {location?.address}</div>
                <div className="font-bold text-foreground">• Costo: ${cost.toLocaleString()}</div>
                <div>• Tiempo estimado: 30-45 minutos</div>
              </div>
            </div>
            {step === 3 && (
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
