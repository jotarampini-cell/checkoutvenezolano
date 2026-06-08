'use client'

interface StoreSelectorProps {
  onSelect: (store: string) => void
}

export function StoreSelector({ onSelect }: StoreSelectorProps) {
  const stores = [
    {
      id: 'ccs-centro',
      name: 'Caracas Centro',
      address: 'Av. Principal, Centro Comercial',
      hours: 'Lun-Dom: 9AM - 6PM',
      icon: '🏬',
    },
    {
      id: 'ccs-este',
      name: 'Caracas Este',
      address: 'Calle Real, Centro Comercial Este',
      hours: 'Lun-Dom: 10AM - 7PM',
      icon: '🏬',
    },
    {
      id: 'margarita',
      name: 'Margarita - Porlamar',
      address: 'Centro Comercial Margarita',
      hours: 'Lun-Dom: 9AM - 6PM',
      icon: '🏝️',
    },
  ]

  return (
    <div className="space-y-3">
      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => onSelect(store.name)}
          className="w-full rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-accent"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{store.icon}</span>
            <div className="flex-1">
              <div className="font-bold text-foreground">{store.name}</div>
              <div className="text-sm text-muted-foreground">{store.address}</div>
              <div className="mt-1 text-xs text-muted-foreground">⏰ {store.hours}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
