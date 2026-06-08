'use client'

interface OrderSummaryProps {
  orderData: any
  currentStep: string
}

export function OrderSummary({ orderData, currentStep }: OrderSummaryProps) {
  const subtotal = 1500000
  const shippingCost = orderData?.shippingCost || 0
  const total = subtotal + shippingCost

  return (
    <div className="sticky top-4 space-y-3 sm:space-y-4">
      {/* Summary Card */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="text-base font-bold text-foreground sm:text-lg">Resumen del Pedido</h2>

        {/* Sample Items */}
        <div className="mt-3 space-y-2 border-b border-border pb-3 sm:mt-4 sm:space-y-3 sm:pb-4">
          <div className="flex justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground sm:text-sm">Producto 1</div>
              <div className="text-xs text-muted-foreground">Cantidad: 2</div>
            </div>
            <div className="text-xs font-bold text-foreground sm:text-sm flex-shrink-0">$600k</div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-foreground sm:text-sm">Producto 2</div>
              <div className="text-xs text-muted-foreground">Cantidad: 1</div>
            </div>
            <div className="text-xs font-bold text-foreground sm:text-sm flex-shrink-0">$900k</div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="mt-3 space-y-1 sm:mt-4 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">${(subtotal / 1000).toFixed(0)}k</span>
          </div>
          {orderData?.shippingCost > 0 && (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Envío/Delivery</span>
              <span className="text-foreground font-medium">${(shippingCost / 1000).toFixed(0)}k</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="mt-3 border-t border-border pt-3 sm:mt-4 sm:pt-4">
          <div className="flex justify-between">
            <span className="font-bold text-foreground text-sm sm:text-base">Total</span>
            <span className="text-lg font-bold text-primary sm:text-xl">${(total / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      {orderData && (
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <h3 className="text-xs font-bold text-foreground sm:text-sm">Detalles de Entrega</h3>

          {orderData.mode === 'local' && (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground sm:mt-3 sm:space-y-2 sm:text-sm">
              <div className="truncate">📍 Zona: {orderData.zone}</div>
              <div className="truncate">📍 {orderData.location?.address}</div>
              <div className="font-bold text-foreground">⏱️ {orderData.eta}</div>
            </div>
          )}

          {orderData.mode === 'national' && (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground sm:mt-3 sm:space-y-2 sm:text-sm">
              <div className="truncate">📦 {orderData.transport}</div>
              <div className="truncate">📍 {orderData.state} → {orderData.city}</div>
              <div className="truncate">🏢 {orderData.branch}</div>
              <div className="font-bold text-foreground">⏱️ {orderData.eta}</div>
            </div>
          )}

          {orderData.mode === 'pickup' && (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground sm:mt-3 sm:space-y-2 sm:text-sm">
              <div className="truncate">🏬 {orderData.store}</div>
              <div>💳 Pago: {orderData.paymentOption === 'online' ? 'Anticipado' : 'En tienda'}</div>
              <div className="font-bold text-foreground">⏱️ Retiro inmediato</div>
            </div>
          )}
        </div>
      )}

      {/* Payment Method */}
      {orderData?.paymentMethod && (
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <h3 className="text-xs font-bold text-foreground sm:text-sm">Método de Pago</h3>
          <div className="mt-2 text-xs text-muted-foreground sm:text-sm">
            {orderData.paymentMethod === 'pago-movil' && '📱 Pago Móvil'}
            {orderData.paymentMethod === 'transferencia' && '🏦 Transferencia Bancaria'}
            {orderData.paymentMethod === 'zelle' && '💳 Zelle'}
            {orderData.paymentMethod === 'divisas' && '💵 Divisas'}
          </div>
        </div>
      )}

      {/* Customer Info */}
      {orderData?.customerInfo && (
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <h3 className="text-xs font-bold text-foreground sm:text-sm">Tu Información</h3>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground sm:mt-3 sm:space-y-2">
            <div className="truncate">👤 {orderData.customerInfo.fullName}</div>
            <div className="truncate">🆔 {orderData.customerInfo.cedula}</div>
            <div className="truncate">📞 {orderData.customerInfo.phoneNumber}</div>
            {orderData.customerInfo.email && (
              <div className="truncate">📧 {orderData.customerInfo.email}</div>
            )}
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="rounded-lg bg-muted p-3 sm:p-4">
        <div className="text-xs font-medium text-muted-foreground uppercase">Paso Actual</div>
        <div className="mt-1 text-xs font-bold text-foreground sm:mt-2 sm:text-sm">
          {currentStep === 'delivery-mode' && '1. Tu información'}
          {currentStep === 'delivery-details' && '2. Detalles de entrega'}
          {currentStep === 'payment' && '3. Método de pago'}
        </div>
      </div>
    </div>
  )
}
