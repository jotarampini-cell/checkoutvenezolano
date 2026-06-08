import { Trash2, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  emoji: string
  details: string
}

export const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    name: 'Zapatos Deportivos',
    price: 50,
    quantity: 2,
    emoji: '👟',
    details: 'Talla 42 • Color Negro'
  },
  {
    id: '2',
    name: 'Franela Básica',
    price: 30,
    quantity: 1,
    emoji: '👕',
    details: 'Talla M • Color Blanco'
  }
]

interface CartItemListProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  formatPrice: (amount: number) => string
  readonly?: boolean
}

export function CartItemList({ items, onUpdateQuantity, onRemoveItem, formatPrice, readonly = false }: CartItemListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">El carrito está vacío</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.id} className="flex gap-3">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
            <span className="text-2xl opacity-50">{item.emoji}</span>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-bold text-foreground leading-tight">{item.name}</p>
                <p className="text-sm font-bold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{item.details}</p>
            </div>
            
            {!readonly && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center bg-secondary rounded-lg border border-border overflow-hidden">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1.5 hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5 text-foreground" />
                  </button>
                  <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1.5 hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-foreground" />
                  </button>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {readonly && (
              <p className="text-[10px] font-bold mt-1 bg-secondary inline-block px-2 py-0.5 rounded-md self-start">
                Cant: {item.quantity}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
