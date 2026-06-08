'use client'

import { useState } from 'react'

interface MapPickerProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void
}

export function MapPicker({ onSelect }: MapPickerProps) {
  const [lat, setLat] = useState(10.4806)
  const [lng, setLng] = useState(-66.9036)
  const [address, setAddress] = useState('Caracas, Venezuela')
  const [showMap, setShowMap] = useState(false)

  const handleConfirm = () => {
    onSelect({ lat, lng, address })
  }

  const handleMapClick = () => {
    setShowMap(true)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="mb-4 text-sm font-medium text-foreground">Arrastrar el pin en el mapa para ajustar tu ubicación</div>

        {/* Map Simulation */}
        <div
          className="relative mb-4 cursor-move overflow-hidden rounded-lg border border-border bg-background"
          style={{ height: '300px' }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-background">
            <div className="text-center">
              <div className="text-4xl">📍</div>
              <div className="mt-2 text-sm font-bold text-foreground">Mapa interactivo</div>
              <div className="text-xs text-muted-foreground">Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</div>
            </div>
          </div>

          {/* Pin Marker */}
          <div
            className="absolute flex flex-col items-center transition"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -100%)',
              cursor: 'grab',
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              const startX = e.clientX
              const startY = e.clientY
              const startLat = lat
              const startLng = lng

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX
                const deltaY = moveEvent.clientY - startY
                setLat(startLat + deltaY * 0.00001)
                setLng(startLng + deltaX * 0.00001)
              }

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }

              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            <div className="text-3xl">📍</div>
          </div>
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground"
            placeholder="Ej: Av. Principal, Centro Comercial"
          />
        </div>

        {/* Coordinates Display */}
        <div className="mt-3 space-y-1 rounded bg-background p-3 text-sm text-muted-foreground">
          <div>📍 Latitud: {lat.toFixed(6)}</div>
          <div>📍 Longitud: {lng.toFixed(6)}</div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90"
      >
        Confirmar Ubicación
      </button>
    </div>
  )
}
