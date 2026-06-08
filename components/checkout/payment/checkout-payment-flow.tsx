'use client'

import { useState } from 'react'
import { PagoMetodoScreen } from './pago-metodo-screen'
import { PagoInstruccionesScreen } from './pago-instrucciones-screen'
import { PagoReporteScreen } from './pago-reporte-screen'
import { PagoEsperaScreen } from './pago-espera-screen'

interface CheckoutPaymentFlowProps {
  onComplete?: (data: any) => void
  onBack?: () => void
}

export type PaymentStep = 'metodo' | 'instrucciones' | 'reporte' | 'espera' | 'rechazado'

export function CheckoutPaymentFlow({ onComplete, onBack }: CheckoutPaymentFlowProps) {
  const [step, setStep] = useState<PaymentStep>('metodo')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [reporteData, setReporteData] = useState<any>(null)

  // Mock data
  const mockData = {
    numeroPedido: 'VE82500681',
    monto: {
      bs: 1600000,
      usd: 43.84,
    },
    tasaBCV: 36.50,
    telefonoPagoMovil: '0414-123-4567',
    bancoPagoMovil: 'Banesco',
    cedulaReceptor: 'V-12.345.678',
    nombreTitular: 'Juan Pérez',
    cuentaTransferencia: '0134-0123-45-1234567890',
    emailZelle: 'pagos@empresa.com',
  }

  const handleMetodoSelect = (metodo: string) => {
    setSelectedMethod(metodo)
    setStep('instrucciones')
  }

  const handleBackToMetodo = () => {
    setStep('metodo')
  }

  const handleReportComplete = (data: any) => {
    setReporteData(data)
    setStep('espera')
  }

  const handleNuevoPedido = () => {
    // Reset to initial state
    setStep('metodo')
    setSelectedMethod(null)
    setReporteData(null)
    if (onComplete) {
      onComplete({ status: 'new-order' })
    }
  }

  const handleIrInicio = () => {
    if (onBack) {
      onBack()
    }
  }

  return (
    <div>
      {step === 'metodo' && (
        <PagoMetodoScreen
          onMetodoSelect={handleMetodoSelect}
          onBack={onBack}
        />
      )}

      {step === 'instrucciones' && selectedMethod && (
        <PagoInstruccionesScreen
          metodo={selectedMethod}
          numeroPedido={mockData.numeroPedido}
          monto={mockData.monto}
          tasaBCV={mockData.tasaBCV}
          telefonoPagoMovil={mockData.telefonoPagoMovil}
          bancoPagoMovil={mockData.bancoPagoMovil}
          cedulaReceptor={mockData.cedulaReceptor}
          nombreTitular={mockData.nombreTitular}
          cuentaTransferencia={mockData.cuentaTransferencia}
          emailZelle={mockData.emailZelle}
          onReportClick={() => setStep('reporte')}
          onBackClick={handleBackToMetodo}
        />
      )}

      {step === 'reporte' && selectedMethod && (
        <PagoReporteScreen
          metodo={selectedMethod}
          numeroPedido={mockData.numeroPedido}
          monto={mockData.monto}
          onReportComplete={handleReportComplete}
          onBackClick={() => setStep('instrucciones')}
        />
      )}

      {step === 'espera' && (
        <PagoEsperaScreen
          numeroPedido={mockData.numeroPedido}
          metodo={selectedMethod || ''}
          onNuevoPedido={handleNuevoPedido}
          onIrInicio={handleIrInicio}
        />
      )}
    </div>
  )
}
