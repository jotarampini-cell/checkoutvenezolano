'use client'

import { useState, useRef } from 'react'
import { MapPicker } from '../map-picker'
import { CitySelector } from '../city-selector'
import { ZoneSelector } from '../zone-selector'
import { MapPin, Navigation, Clock, DollarSign, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STORE_CONFIG } from '@/lib/store-config'

interface LocalDeliveryProps {
  onComplete: (data: any) => void
}

export function LocalDelivery({ onComplete }: LocalDeliveryProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [cost, setCost] = useState<number | null>(null)
  const [reference, setReference] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const zoneSectionRef = useRef<HTMLDivElement>(null)
  const mapSectionRef = useRef<HTMLDivElement>(null)

  const getZoneCost = (cityId: string | null, zoneId: string | null) => {
    if (!cityId || !zoneId) return null
    const city = STORE_CONFIG.delivery.cities.find(c => c.id === cityId)
    const zone = city?.zones.find(z => z.id === zoneId)
    return zone?.cost || null
  }

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId)
    setSelectedZone(null)
    setCost(null)
    setTimeout(() => {
      zoneSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZone(zoneId)
    setCost(getZoneCost(selectedCity, zoneId))
    // Auto-scroll to map section after a short delay
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const handleLocationSelect = (coords: { lat: number; lng: number; address: string }) => {
    setLocation(coords)
  }

  const handleConfirm = () => {
    if (!selectedZone || !location) {
      setShowErrors(true)
      
      // Auto-scroll to the first error
      const firstError = document.querySelector('.error-highlight')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    onComplete({
      mode: 'local',
      zone: selectedZone,
      location,
      reference,
      shippingCost: cost,
      eta: '30-45 minutos',
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Seleccionar Ciudad */}
      <div className={cn("space-y-3 p-3 rounded-xl transition-all", showErrors && !selectedCity && "bg-destructive/5 ring-1 ring-destructive error-highlight")}>
        <label className={cn("text-sm font-semibold flex items-center gap-2", showErrors && !selectedCity ? "text-destructive" : "text-foreground")}>
          {selectedCity ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold", showErrors && !selectedCity ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary")}>1</div>
          )}
          ¿En qué ciudad te encuentras?
        </label>
        <CitySelector onSelect={handleCitySelect} selected={selectedCity} />
        <p className="text-[11px] text-muted-foreground leading-snug px-1">
          Si no ves tu ciudad en la lista, significa que nuestro servicio de delivery local no está disponible allí. Puedes elegir <span className="font-semibold text-foreground">Envío Nacional</span> o <span className="font-semibold text-foreground">Retiro en Tienda</span> en el menú anterior.
        </p>
        {showErrors && !selectedCity && (
          <p className="text-xs font-medium text-destructive mt-1 animate-fade-in">Falta seleccionar tu ciudad</p>
        )}
      </div>

      {/* 2. Seleccionar Zona (se activa si hay ciudad seleccionada) */}
      <div
        ref={zoneSectionRef}
        className={cn("transition-all duration-500 scroll-mt-4", selectedCity ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[0.5]")}
      >
        <div className={cn("space-y-3 p-3 rounded-xl transition-all", showErrors && selectedCity && !selectedZone && "bg-destructive/5 ring-1 ring-destructive error-highlight")}>
          <label className={cn("text-sm font-semibold flex items-center gap-2", showErrors && selectedCity && !selectedZone ? "text-destructive" : "text-foreground")}>
            {selectedZone ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold", showErrors && selectedCity && !selectedZone ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary")}>2</div>
            )}
            ¿En qué zona?
          </label>
          {selectedCity && <ZoneSelector cityId={selectedCity} onSelect={handleZoneSelect} selected={selectedZone} />}
          {selectedCity && (
            <p className="text-[11px] text-muted-foreground leading-snug px-1 mt-1">
              Si tu zona exacta no aparece, es porque se encuentra fuera de nuestro radio de cobertura actual.
            </p>
          )}
          {showErrors && selectedCity && !selectedZone && (
            <p className="text-xs font-medium text-destructive mt-1 animate-fade-in">Falta seleccionar la zona de entrega</p>
          )}
        </div>
      </div>

      <div
        ref={mapSectionRef}
        className={cn("transition-all duration-500 scroll-mt-4", selectedZone ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[0.5]")}
      >
        <div className={cn("space-y-3 p-3 rounded-xl transition-all", showErrors && selectedZone && !location && "bg-destructive/5 ring-1 ring-destructive error-highlight")}>
          <label className={cn("text-sm font-semibold flex items-center gap-2", showErrors && selectedZone && !location ? "text-destructive" : "text-foreground")}>
            {location ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold", showErrors && selectedZone && !location ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary")}>3</div>
            )}
            Confirma tu ubicación exacta
          </label>
          <MapPicker onSelect={handleLocationSelect} />
          {showErrors && selectedZone && !location && (
            <p className="text-xs font-medium text-destructive mt-1 animate-fade-in">Falta confirmar la dirección en el mapa</p>
          )}
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
                <p className="text-xs text-muted-foreground mt-1">
                  {STORE_CONFIG.delivery.cities.find(c => c.id === selectedCity)?.name} — {STORE_CONFIG.delivery.cities.find(c => c.id === selectedCity)?.zones.find(z => z.id === selectedZone)?.name}
                </p>
              </div>
            </div>
            
            <div className="divider my-2" />
            
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

          {/* Reference / Landmark field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
              <Navigation className="h-3 w-3" /> Punto de referencia
            </label>
            <input
              type="text"
              placeholder="Ej: Torre azul, piso 3, frente al Metro..."
              className="input-premium"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground ml-1">Ayuda al repartidor a encontrarte más rápido</p>
          </div>
        </div>
      )}

      {/* This button is permanently in the DOM so the sticky "Continuar" button always finds it */}
      <button
        id="submit-step-btn"
        onClick={handleConfirm}
        className="hidden"
      >
        Continuar con esta entrega
      </button>
    </div>
  )
}
