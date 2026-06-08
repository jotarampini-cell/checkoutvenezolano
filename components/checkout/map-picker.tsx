'use client'

import { useState } from 'react'
import { MapPin, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapPickerProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void
}

export function MapPicker({ onSelect }: MapPickerProps) {
  const [address, setAddress] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [dragComplete, setDragComplete] = useState(false)

  const handleConfirm = () => {
    if (!address) return
    onSelect({
      lat: 10.4806 + Math.random() * 0.01,
      lng: -66.9036 + Math.random() * 0.01,
      address
    })
  }

  const handleDragStart = () => {
    setIsDragging(true)
    setDragComplete(false)
  }

  const handleDragEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      setDragComplete(true)
      setTimeout(() => setDragComplete(false), 3000)
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className={cn("relative h-[160px] sm:h-[200px] w-full overflow-hidden rounded-xl border border-border bg-muted/30 touch-none cursor-grab active:cursor-grabbing transition-shadow", isDragging && "ring-2 ring-primary/50 shadow-lg")}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
      >
        <div className={cn("absolute inset-0 transition-opacity duration-300 pointer-events-none", isDragging ? "opacity-60" : "opacity-40")}>
          <iframe 
            src="https://www.openstreetmap.org/export/embed.html?bbox=-66.9536%2C10.4506%2C-66.8536%2C10.5106&layer=mapnik" 
            className="w-[150%] h-[150%] -ml-[25%] -mt-[25%]"
            style={{ border: 0 }} 
          />
        </div>
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={cn("transition-all duration-300 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md shadow-glow", 
            isDragging ? "-translate-y-4 scale-110 bg-primary text-primary-foreground shadow-xl" : "bg-primary/20 text-primary"
          )}>
            <MapPin className="h-5 w-5" />
          </div>
          <div className="mt-2 rounded-full bg-background/80 px-3 py-1 text-[10px] font-medium text-foreground backdrop-blur-md shadow-sm border border-border transition-all">
            {isDragging ? 'Moviendo mapa...' : dragComplete ? <span className="flex items-center gap-1 text-success"><CheckCircle2 className="h-3 w-3"/> Ubicación fijada</span> : 'Mueve el mapa para fijar'}
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
