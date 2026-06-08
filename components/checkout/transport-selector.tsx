'use client'

import { Package, Truck, Navigation } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TransportSelectorProps {
  onSelect: (transport: string) => void
  selected?: string | null
}

const TRANSPORTS = [
  { id: 'MRW', name: 'MRW', icon: Truck, eta: '2-3 días' },
  { id: 'Zoom', name: 'Zoom', icon: Package, eta: '24-48 horas' },
  { id: 'Tealca', name: 'Tealca', icon: Navigation, eta: '3-4 días' },
  { id: 'Domesa', name: 'Domesa', icon: Package, eta: '3-5 días' }
]

export function TransportSelector({ onSelect, selected }: TransportSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TRANSPORTS.map(transport => {
        const Icon = transport.icon
        const isSelected = selected === transport.id
        
        return (
          <div
            key={transport.id}
            onClick={() => onSelect(transport.id)}
            className={cn(
              "card-interactive p-3 flex flex-col items-center justify-center text-center gap-2",
              isSelected && "selected"
            )}
          >
            <div className={cn("p-2 rounded-lg bg-muted transition-colors", isSelected && "bg-primary text-primary-foreground")}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{transport.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{transport.eta}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
