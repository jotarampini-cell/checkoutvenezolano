'use client'

import { ShoppingBag, Tag } from 'lucide-react'
import { CartItemList, CartItem } from './cart-item-list'
import { cn } from '@/lib/utils'

interface OrderSummaryProps {
  orderData: any
  currentStep: string
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
  currency?: 'USD' | 'VES'
  onCurrencyChange?: (c: 'USD' | 'VES') => void
}

export function OrderSummary({ 
  orderData, 
  currentStep, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  currency = 'USD',
  onCurrencyChange
}: OrderSummaryProps) {
  const EXCHANGE_RATE = 567.68
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = orderData?.shippingCost || 0
  const total = subtotal + shippingCost

  const formatPrice = (amountInUsd: number) => {
    if (currency === 'VES') {
      const amountInVes = amountInUsd * EXCHANGE_RATE
      return new Intl.NumberFormat('es-VE', {
        style: 'currency',
        currency: 'VES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amountInVes)
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amountInUsd)
  }

  return (
    <div className="sticky top-24 card-premium overflow-hidden">
      <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Resumen</h2>
          <p className="text-xs text-muted-foreground capitalize">Paso actual: {currentStep}</p>
        </div>
      </div>

      <div className="bg-muted/50 p-2 mx-6 mt-4 rounded-lg flex items-center justify-between">
        <button 
          onClick={() => onCurrencyChange?.('USD')}
          className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-colors", currency === 'USD' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          USD $
        </button>
        <button 
          onClick={() => onCurrencyChange?.('VES')}
          className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-colors", currency === 'VES' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
        >
          VES Bs
        </button>
      </div>

      <div className="p-6 pt-4">
        {/* Products */}
        <CartItemList 
          items={cartItems} 
          onUpdateQuantity={onUpdateQuantity} 
          onRemoveItem={onRemoveItem} 
          formatPrice={formatPrice}
        />
        
        <div className="divider my-6" />

        {/* Promo Code */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Código de descuento" 
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="px-4 py-2.5 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            Aplicar
          </button>
        </div>

        <div className="divider my-6" />

        {/* Totals */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío {orderData?.mode ? `(${orderData.mode})` : ''}</span>
            <span className="font-medium text-foreground">
              {shippingCost > 0 
                ? formatPrice(shippingCost) 
                : (orderData?.mode === 'national' 
                    ? 'Cobro a destino' 
                    : (orderData?.mode ? 'Gratis' : 'Por calcular'))}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Impuestos</span>
            <span className="font-medium text-foreground">Incluidos</span>
          </div>

          <div className="divider !my-4" />

          <div className="flex justify-between items-end">
            <span className="text-base font-bold text-foreground">Total a pagar</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary leading-none">{formatPrice(total)}</span>
              <p className="text-[11px] text-muted-foreground mt-1.5 text-right font-medium">Tasa BCV referencial: Bs. 36.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
