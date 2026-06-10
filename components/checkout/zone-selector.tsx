'use client'

import { STORE_CONFIG } from '@/lib/store-config'

interface ZoneSelectorProps {
  cityId: string
  onSelect: (zoneId: string) => void
  selected?: string | null
}

export function ZoneSelector({ cityId, onSelect, selected }: ZoneSelectorProps) {
  const city = STORE_CONFIG.delivery.cities.find(c => c.id === cityId)
  const zones = city?.zones || []

  if (zones.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <select 
        className="select-premium"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>Selecciona tu zona...</option>
        {zones.map(zone => (
          <option key={zone.id} value={zone.id}>{zone.name}</option>
        ))}
      </select>
    </div>
  )
}
