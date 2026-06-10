'use client'

import { STORE_CONFIG } from '@/lib/store-config'

interface CitySelectorProps {
  onSelect: (cityId: string) => void
  selected?: string | null
}

export function CitySelector({ onSelect, selected }: CitySelectorProps) {
  const cities = STORE_CONFIG.delivery.cities

  return (
    <div className="relative">
      <select 
        className="select-premium"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>Selecciona tu ciudad...</option>
        {cities.map(city => (
          <option key={city.id} value={city.id}>{city.name}</option>
        ))}
      </select>
    </div>
  )
}
