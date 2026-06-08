'use client'

import { Store, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreSelectorProps {
  onSelect: (store: string) => void
  selected?: string | null
}

const STORES = [
  { id: 'Sede Chacao', name: 'Sede Chacao', address: 'Av. Francisco de Miranda, Centro Comercial', distance: '1.2 km' },
  { id: 'Sede Las Mercedes', name: 'Sede Las Mercedes', address: 'Calle Madrid, Qta. Principal', distance: '3.5 km' },
  { id: 'Sede La Castellana', name: 'Sede La Castellana', address: 'Av. Principal, Edificio Centro', distance: '4.1 km' }
]

export function StoreSelector({ onSelect, selected }: StoreSelectorProps) {
  return (
    <div className="space-y-3">
      {STORES.map(store => {
        const isSelected = selected === store.id
        
        return (
          <div
            key={store.id}
            onClick={() => onSelect(store.id)}
            className={cn(
              "card-interactive p-4 flex gap-3",
              isSelected && "selected"
            )}
          >
            <div className={cn("radio-indicator mt-1", isSelected && "selected")}>
               <div className="radio-dot" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-bold text-sm text-foreground">{store.name}</p>
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{store.distance}</span>
              </div>
              
              <div className="flex items-start gap-1.5 mt-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{store.address}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
