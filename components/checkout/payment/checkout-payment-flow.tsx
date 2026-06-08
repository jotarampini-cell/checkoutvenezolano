'use client'

import { useState } from 'react'
import { PagoMetodoScreen } from './pago-metodo-screen'
import { PagoInstruccionesScreen } from './pago-instrucciones-screen'
import { PagoReporteScreen } from './pago-reporte-screen'
import { PagoEsperaScreen } from './pago-espera-screen'

interface CheckoutPaymentFlowProps {
  onComplete: (paymentData: any) => void
  onBack?: () => void
}

export function CheckoutPaymentFlow({ onComplete }: CheckoutPaymentFlowProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleReportSubmit = (data: any) => {
    setIsVerifying(true)
    setTimeout(() => {
      onComplete({ method: selectedMethod, report: data })
    }, 2500)
  }

  if (isVerifying) {
    return <PagoEsperaScreen />
  }

  return (
    <div className="space-y-6">
      <PagoMetodoScreen 
        onSelect={(method) => {
          setSelectedMethod(method)
          setShowReportForm(true)
        }} 
        selected={selectedMethod} 
      />

      {selectedMethod && showReportForm && (
        <div className="animate-fade-up space-y-6">
          <PagoInstruccionesScreen methodId={selectedMethod} />
          <PagoReporteScreen 
            methodId={selectedMethod} 
            onSubmit={handleReportSubmit} 
          />
        </div>
      )}
    </div>
  )
}
