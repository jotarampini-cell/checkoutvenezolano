'use client'

interface ZoneSelectorProps {
  onSelect: (zone: string) => void
}

export function ZoneSelector({ onSelect }: ZoneSelectorProps) {
  const zones = [
    { id: 'ccs-este', name: 'Caracas Este', municipalities: 'El Hatillo, Baruta, Chacao' },
    { id: 'ccs-oeste', name: 'Caracas Oeste', municipalities: 'Libertador, La Paz, Sucre' },
    { id: 'ccs-sur', name: 'Caracas Sur', municipalities: 'Petare, San Bernardino' },
    { id: 'margarita', name: 'Isla de Margarita', municipalities: 'Porlamar, Juan Griego' },
    { id: 'maracaibo', name: 'Maracaibo', municipalities: 'Centro, norte de Maracaibo' },
  ]

  return (
    <div className="space-y-3">
      {zones.map((zone) => (
        <button
          key={zone.id}
          onClick={() => onSelect(zone.name)}
          className="w-full rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-accent"
        >
          <div>
            <div className="font-bold text-foreground">{zone.name}</div>
            <div className="text-sm text-muted-foreground">{zone.municipalities}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
