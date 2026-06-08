'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface MapPickerProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void
}

export function MapPicker({ onSelect }: MapPickerProps) {
  const [address, setAddress] = useState('')

  const handleConfirm = () => {
    if (!address) return
    onSelect({
      lat: 10.4806 + Math.random() * 0.01,
      lng: -66.9036 + Math.random() * 0.01,
      address
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[160px] sm:h-[200px] w-full overflow-hidden rounded-xl border border-border bg-muted/30">
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-66.86,10.48,12/600x400?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2V4YW1wbGUifQ.example')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="animate-bounce-subtle flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md shadow-glow">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-2 rounded-full bg-background/80 px-3 py-1 text-[10px] font-medium text-foreground backdrop-blur-md shadow-sm border border-border">
            Mapa de referencia
          </div>
        </div>
      </div>

      <div className="floating-label-group">
        <input
          type="text"
          placeholder=" "
          className={`input-premium ${address ? 'has-value' : ''}`}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label>Dirección exacta (calle, edificio, apto)</label>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!address}
        className="btn-secondary w-full"
      >
        Confirmar dirección
      </button>
    </div>
  )
}
