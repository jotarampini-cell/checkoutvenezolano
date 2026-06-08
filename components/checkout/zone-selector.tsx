'use client'

interface ZoneSelectorProps {
  onSelect: (zone: string) => void
  selected?: string | null
}

const ZONES = [
  'Chacao',
  'Altamira',
  'Los Palos Grandes',
  'Las Mercedes',
  'El Rosal',
  'Bello Monte',
  'La Castellana',
  'La Florida',
  'Los Ruices',
  'Macaracuay'
]

export function ZoneSelector({ onSelect, selected }: ZoneSelectorProps) {
  return (
    <div className="relative">
      <select 
        className="select-premium"
        value={selected || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="" disabled>Selecciona tu zona...</option>
        {ZONES.map(zone => (
          <option key={zone} value={zone}>{zone}</option>
        ))}
      </select>
    </div>
  )
}
