'use client'

import { useState } from 'react'
import { ShoppingBag, Tag } from 'lucide-react'
import { CartItemList, CartItem } from './cart-item-list'
import { cn } from '@/lib/utils'

interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shippingCost: number | null
  total: number
  orderData: any
  currency: 'USD' | 'VES'
  onCurrencyChange?: (currency: 'USD' | 'VES') => void
  showContinueButton?: boolean
  currentStep: string
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
}

export function OrderSummary({ 
  cartItems, 
  subtotal, 
  shippingCost, 
  total, 
  orderData,
  currency,
  onCurrencyChange,
  showContinueButton = false,
  currentStep,
  onUpdateQuantity,
  onRemoveItem
}: OrderSummaryProps) {
  const EXCHANGE_RATE = 567.68
  const [priceKey, setPriceKey] = useState(0)

  const handleCurrencyChange = (c: 'USD' | 'VES') => {
    setPriceKey(k => k + 1)
    onCurrencyChange?.(c)
  }

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

      <div className="bg-muted/50 p-1.5 mx-6 mt-4 rounded-lg flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleCurrencyChange('USD')}
            className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-colors", currency === 'USD' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            USD $
          </button>
          <button 
            onClick={() => handleCurrencyChange('VES')}
            className={cn("flex-1 text-xs font-bold py-1.5 rounded-md transition-colors", currency === 'VES' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            VES
          </button>
        </div>
        {currency === 'VES' && (
          <p className="text-[10px] text-muted-foreground text-center font-medium">
            Tasa BCV: {EXCHANGE_RATE.toLocaleString('es-VE')} Bs. / $1
          </p>
        )}
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

        {/* Totals */}
        <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span key={`subtotal-${priceKey}`} className="font-medium text-foreground price-flip">{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío {orderData?.mode ? `(${orderData.mode})` : ''}</span>
            <span key={`shipping-${priceKey}`} className="font-medium text-foreground price-flip">
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
              <span key={`total-${priceKey}`} className="text-2xl font-bold text-primary leading-none price-flip">{formatPrice(total)}</span>
              <p className="text-[11px] text-muted-foreground mt-1.5 text-right font-medium">Tasa BCV: Bs. {EXCHANGE_RATE.toLocaleString('es-VE')} / USD</p>
            </div>
          </div>
        </div>
        
        {/* Desktop Master Continue Button */}
        {showContinueButton && (
          <button 
            onClick={() => {
              const btn = document.getElementById('submit-step-btn');
              if (btn) btn.click();
            }}
            className="hidden lg:flex w-full btn-primary justify-center items-center h-[52px] rounded-xl font-bold transition-all mt-6 shadow-md hover:shadow-lg"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  )
}
