'use client'

import { useEffect, useState } from 'react'

interface ConfirmationModalProps {
  orderData: any
  confirmationNumber: string
  onNewOrder: () => void
}

export function ConfirmationModal({
  orderData,
  confirmationNumber,
  onNewOrder,
}: ConfirmationModalProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [whatsappSent, setWhatsappSent] = useState(false)

  useEffect(() => {
    // Simulate WhatsApp notification being sent
    const timer = setTimeout(() => {
      setWhatsappSent(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleWhatsappClick = () => {
    // Simulate WhatsApp share
    const message = `Pedido #${confirmationNumber} confirmado! Detalles disponibles en tu cuenta.`
    console.log('[v0] WhatsApp notification:', message)
    alert('Notificación de WhatsApp enviada!')
  }

  return (
    <div className="min-h-[600px] rounded-lg border border-border bg-card p-8 text-center">
      {/* Success Icon */}
      <div className="mb-6 inline-block rounded-full bg-primary/20 p-4">
        <div className="text-5xl">✓</div>
      </div>

      {/* Main Message */}
      <h1 className="mb-2 text-3xl font-bold text-foreground">¡Pedido Confirmado!</h1>
      <p className="mb-6 text-lg text-muted-foreground">Tu compra fue procesada exitosamente</p>

      {/* Confirmation Number */}
      <div className="mb-8 rounded-lg bg-muted p-6">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Número de Confirmación
        </div>
        <div className="mt-2 font-mono text-2xl font-bold text-primary">{confirmationNumber}</div>
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(confirmationNumber)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            📋 Copiar
          </button>
        </div>
      </div>

      {/* WhatsApp Notification Status */}
      <div className="mb-8 rounded-lg border border-border bg-background p-4">
        <div className="flex items-center justify-center gap-2">
          <div className={`flex h-3 w-3 rounded-full ${whatsappSent ? 'bg-primary' : 'bg-muted'}`} />
          <span className="text-sm text-muted-foreground">
            {whatsappSent ? '✓ Confirmación enviada a WhatsApp' : 'Enviando confirmación...'}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      {orderData.customerInfo && (
        <div className="mb-8 rounded-lg border border-border bg-background p-4 text-left">
          <h3 className="font-bold text-foreground">Tu Información</h3>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Nombre:</span>
              <span className="font-medium text-foreground">{orderData.customerInfo.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span>Cédula:</span>
              <span className="font-medium text-foreground">{orderData.customerInfo.cedula}</span>
            </div>
            <div className="flex justify-between">
              <span>Teléfono:</span>
              <span className="font-medium text-foreground">{orderData.customerInfo.phoneNumber}</span>
            </div>
            {orderData.customerInfo.email && (
              <div className="flex justify-between">
                <span>Correo:</span>
                <span className="font-medium text-foreground">{orderData.customerInfo.email}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="mb-8 space-y-4 rounded-lg border border-border bg-background p-4 text-left">
        <div className="flex cursor-pointer items-center justify-between" onClick={() => setShowDetails(!showDetails)}>
          <h3 className="font-bold text-foreground">Detalles del Pedido</h3>
          <span className="text-muted-foreground">{showDetails ? '▼' : '▶'}</span>
        </div>

        {showDetails && (
          <div className="space-y-3 border-t border-border pt-4">
            {orderData.mode === 'local' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modalidad:</span>
                  <span className="font-medium text-foreground">Delivery Local</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zona:</span>
                  <span className="font-medium text-foreground">{orderData.zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="font-medium text-foreground">{orderData.location?.address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiempo estimado:</span>
                  <span className="font-medium text-foreground">{orderData.eta}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Costo de entrega:</span>
                    <span className="text-primary">${orderData.shippingCost?.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            {orderData.mode === 'national' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modalidad:</span>
                  <span className="font-medium text-foreground">Envío Nacional</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transportista:</span>
                  <span className="font-medium text-foreground">{orderData.transport}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destino:</span>
                  <span className="font-medium text-foreground">
                    {orderData.state} → {orderData.city}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sucursal:</span>
                  <span className="font-medium text-foreground">{orderData.branch}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiempo estimado:</span>
                  <span className="font-medium text-foreground">{orderData.eta}</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Costo de envío:</span>
                    <span className="text-primary">${orderData.shippingCost?.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            {orderData.mode === 'pickup' && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modalidad:</span>
                  <span className="font-medium text-foreground">Retiro en Tienda</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sede:</span>
                  <span className="font-medium text-foreground">{orderData.store}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pago:</span>
                  <span className="font-medium text-foreground">
                    {orderData.paymentOption === 'online' ? 'Anticipado (Online)' : 'En Tienda'}
                  </span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="rounded bg-muted p-2 text-sm font-bold text-foreground">
                    Código de Retiro: {orderData.pickupCode}
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Método de Pago:</span>
                <span className="font-medium text-foreground">
                  {orderData.paymentMethod === 'pago-movil' && 'Pago Móvil'}
                  {orderData.paymentMethod === 'transferencia' && 'Transferencia'}
                  {orderData.paymentMethod === 'zelle' && 'Zelle'}
                  {orderData.paymentMethod === 'divisas' && 'Divisas'}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="text-lg font-bold text-primary">$1.600.000</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleWhatsappClick}
          className="w-full rounded-lg border border-primary bg-primary/10 py-3 font-bold text-primary transition hover:bg-primary/20"
        >
          💬 Enviar a WhatsApp
        </button>
        <button
          onClick={onNewOrder}
          className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90"
        >
          Realizar Otro Pedido
        </button>
      </div>

      {/* Footer Message */}
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        <p>Recibirás actualizaciones sobre tu pedido en WhatsApp</p>
        <p className="mt-1">¡Gracias por tu compra!</p>
      </div>
    </div>
  )
}
