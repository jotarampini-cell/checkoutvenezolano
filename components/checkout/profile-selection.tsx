'use client'

import { useState } from 'react'
import { Shield, MessageCircle, X } from 'lucide-react'
import { CustomerInfoForm } from './customer-info-form'
import { getProfileByPhone, type CustomerInfo } from '@/lib/mock-profiles'
import { cn } from '@/lib/utils'

interface ProfileSelectionProps {
  onComplete: (data: CustomerInfo) => void
  onBack?: () => void
}

export function ProfileSelection({ onComplete }: ProfileSelectionProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verifyPhone, setVerifyPhone] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyStep, setVerifyStep] = useState<'phone' | 'code'>('phone')
  const [verifyError, setVerifyError] = useState('')
  const [loading, setLoading] = useState(false)

  // This will be passed to CustomerInfoForm if verification succeeds
  const [prefilledData, setPrefilledData] = useState<CustomerInfo | null>(null)

  const handleSendCode = async () => {
    if (verifyPhone.length < 10) {
      setVerifyError('Ingresa un número válido')
      return
    }
    setVerifyError('')
    setLoading(true)
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setVerifyStep('code')
  }

  const handleVerifyCode = async () => {
    if (verifyCode.length < 4) {
      setVerifyError('Código inválido')
      return
    }
    setVerifyError('')
    setLoading(true)
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000))
    
    let profile = getProfileByPhone(verifyPhone)
    
    // Bypass for testing
    if (verifyCode === '1234') {
      profile = {
        name: 'Usuario Verificado',
        idType: 'V',
        idNumber: '12345678',
        phone: verifyPhone || '04141234567',
        email: 'usuario@prueba.com'
      }
    }

    if (profile) {
      setPrefilledData(profile)
      setShowVerificationModal(false)
      // Reset state for future
      setVerifyStep('phone')
      setVerifyPhone('')
      setVerifyCode('')
    } else {
      setVerifyError('Código incorrecto o expirado')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Optional Verification Banner */}
      {!prefilledData && (
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold text-foreground">¿Ya tienes cuenta?</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Verifica tu número y precarga tus datos guardados.</p>
          </div>
          <button 
            onClick={() => setShowVerificationModal(true)}
            className="btn-ghost bg-primary/10 text-primary hover:bg-primary/20 whitespace-nowrap self-start sm:self-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Verificar por WhatsApp
          </button>
        </div>
      )}

      {prefilledData && (
        <div className="rounded-xl bg-success/10 border border-success/20 p-4 animate-fade-down flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20 text-success shrink-0">
             <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-success">Cuenta verificada</p>
            <p className="text-xs text-success/80 mt-0.5">Tus datos han sido precargados de forma segura.</p>
          </div>
        </div>
      )}

      {/* Main Data Form */}
      <div>
        <CustomerInfoForm 
          initialData={prefilledData} 
          onComplete={onComplete} 
        />
      </div>

      <div className="flex justify-center pt-2">
        <div className="trust-badge animate-fade-in">
          <Shield className="h-3.5 w-3.5" />
          Tus datos están encriptados y protegidos
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl border border-border animate-scale-in relative">
            <button 
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold">Verificación rápida</h2>
              <p className="text-sm text-muted-foreground mt-1">Te enviaremos un código por WhatsApp</p>
            </div>

            {verifyStep === 'phone' ? (
              <div className="space-y-4">
                <div className="floating-label-group">
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder=" "
                    className={cn("input-premium", verifyPhone && "has-value", verifyError && "error")}
                    value={verifyPhone}
                    onChange={(e) => {
                      setVerifyPhone(e.target.value)
                      setVerifyError('')
                    }}
                  />
                  <label>Número de WhatsApp</label>
                </div>
                {verifyError && <p className="text-xs text-destructive">{verifyError}</p>}
                
                <button 
                  onClick={handleSendCode}
                  disabled={loading || !verifyPhone}
                  className="btn-primary w-full"
                >
                  {loading ? <div className="spinner" /> : "Enviar código"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-center text-foreground font-medium">
                  Enviado al {verifyPhone}
                </p>
                <div className="floating-label-group">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder=" "
                    className={cn("input-premium text-center tracking-widest text-lg font-bold", verifyCode && "has-value", verifyError && "error")}
                    value={verifyCode}
                    onChange={(e) => {
                      setVerifyCode(e.target.value)
                      setVerifyError('')
                    }}
                    maxLength={6}
                  />
                  <label className="text-center w-full left-0">Código de 4 dígitos</label>
                </div>
                {verifyError && <p className="text-xs text-destructive">{verifyError}</p>}
                
                <button 
                  onClick={handleVerifyCode}
                  disabled={loading || verifyCode.length < 4}
                  className="btn-primary w-full"
                >
                  {loading ? <div className="spinner" /> : "Verificar y continuar"}
                </button>
                <button 
                  onClick={() => setVerifyStep('phone')}
                  className="w-full text-xs text-muted-foreground font-medium hover:text-primary transition-colors text-center mt-2"
                >
                  Cambiar número
                </button>
              </div>
            )}
            
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-800">
              <span className="font-bold">Para probar:</span> Usa cualquier teléfono y el código <span className="font-mono bg-white px-1 py-0.5 rounded border border-blue-200">1234</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
