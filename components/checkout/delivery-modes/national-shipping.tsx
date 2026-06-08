'use client'

import { useState } from 'react'
import { TransportSelector } from '../transport-selector'
import { LocationCascade } from '../location-cascade'

interface NationalShippingProps {
  step: number
  onStepChange: (step: number) => void
  onComplete: (data: any) => void
}

export function NationalShipping({ step, onStepChange, onComplete }: NationalShippingProps) {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [cost, setCost] = useState<number>(0)

  const handleTransportSelect = (transport: string) => {
    setSelectedTransport(transport)
    onStepChange(2)
  }

  const handleLocationSelect = (state: string, city: string, branch: string) => {
    setSelectedState(state)
    setSelectedCity(city)
    setSelectedBranch(branch)
    // Calculate cost based on transport and destination
    const baseCost = 150000
    setCost(baseCost)
    onStepChange(3)
  }

  const handleConfirm = () => {
    onComplete({
      mode: 'national',
      transport: selectedTransport,
      state: selectedState,
      city: selectedCity,
      branch: selectedBranch,
      shippingCost: cost,
      eta: '3-5 días hábiles',
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
            <h3 className="text-lg font-bold text-foreground">Elige empresa de transporte</h3>
          </div>
          {step === 1 ? (
            <TransportSelector onSelect={handleTransportSelect} />
          ) : (
            <div className="rounded bg-muted p-3 text-sm text-foreground">
              ✓ Transportista: <span className="font-bold">{selectedTransport}</span>
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
            <h3 className="text-lg font-bold text-foreground">Selecciona estado, ciudad y sucursal</h3>
          </div>
          {step === 2 ? (
            <LocationCascade onSelect={handleLocationSelect} transport={selectedTransport} />
          ) : (
            <div className="space-y-2 rounded bg-muted p-3">
              <div className="text-sm text-foreground">✓ Destino configurado:</div>
              <div className="text-sm text-muted-foreground">
                <div>{selectedState} → {selectedCity}</div>
                <div className="font-bold text-foreground">Sucursal: {selectedBranch}</div>
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
            <h3 className="text-lg font-bold text-foreground">Confirma tu envío</h3>
          </div>
          <div className="space-y-3">
            <div className="rounded bg-muted p-3">
              <div className="text-sm font-medium text-foreground">Resumen de envío:</div>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div>• Transportista: {selectedTransport}</div>
                <div>• Destino: {selectedState} → {selectedCity}</div>
                <div>• Sucursal: {selectedBranch}</div>
                <div className="font-bold text-foreground">• Costo: ${cost.toLocaleString()}</div>
                <div>• Tiempo estimado: 3-5 días hábiles</div>
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
