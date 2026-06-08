'use client'

import { CheckCircle2, MessageCircle, Copy } from 'lucide-react'
import { useState } from 'react'

interface ConfirmationModalProps {
  orderData: any
  confirmationNumber: string
  onNewOrder: () => void
}

export function ConfirmationModal({ orderData, confirmationNumber, onNewOrder }: ConfirmationModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmationNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/584141234567?text=Hola,%20acabo%20de%20realizar%20un%20pedido.%20Referencia:%20${confirmationNumber}`, '_blank')
  }

  return (
    <div className="mx-auto max-w-lg text-center animate-fade-in py-8">
      <div className="flex justify-center mb-8">
        <div className="success-circle">
          <CheckCircle2 className="h-10 w-10 text-white success-check" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">¡Pedido Confirmado!</h1>
      <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
        Hemos recibido tu orden correctamente. Te enviaremos actualizaciones sobre el estado de tu pedido.
      </p>

      <div className="card-premium p-6 mb-8 text-left bg-muted/10">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Orden de Compra</p>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-foreground bg-muted px-2 py-1 rounded-md">{confirmationNumber}</span>
            <button 
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="divider my-4" />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Método de entrega</span>
            <span className="font-medium capitalize">{orderData?.mode || 'Local'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Método de pago</span>
            <span className="font-medium capitalize">{(orderData?.method || 'Pago Móvil').replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total pagado</span>
            <span className="font-bold text-primary">$1.55M</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <button 
          onClick={handleWhatsApp}
          className="btn-primary !bg-[#25D366] !text-white hover:opacity-90 border-none shadow-[0_4px_14px_rgba(37,211,102,0.39)]"
        >
          <MessageCircle className="h-5 w-5" />
          Enviar comprobante por WhatsApp
        </button>

        <button 
          onClick={onNewOrder}
          className="btn-ghost w-full"
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  )
}
