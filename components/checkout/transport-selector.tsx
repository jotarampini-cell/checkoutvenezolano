'use client'

interface TransportSelectorProps {
  onSelect: (transport: string) => void
}

export function TransportSelector({ onSelect }: TransportSelectorProps) {
  const transports = [
    { id: 'mrw', name: 'MRW', coverage: 'Todo el país', icon: '🚛' },
    { id: 'zoom', name: 'Zoom', coverage: 'Principales ciudades', icon: '🚙' },
    { id: 'tealca', name: 'Tealca', coverage: 'Nacional', icon: '📦' },
    { id: 'dhl', name: 'DHL', coverage: 'Todo el país', icon: '✈️' },
    { id: 'fedex', name: 'FedEx', coverage: 'Principales ciudades', icon: '🌍' },
  ]

  return (
    <div className="space-y-3">
      {transports.map((transport) => (
        <button
          key={transport.id}
          onClick={() => onSelect(transport.name)}
          className="w-full rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{transport.icon}</span>
            <div>
              <div className="font-bold text-foreground">{transport.name}</div>
              <div className="text-sm text-muted-foreground">{transport.coverage}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
