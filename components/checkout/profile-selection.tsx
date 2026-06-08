'use client'

import { useState } from 'react'
import { CustomerInfoForm } from './customer-info-form'
import { getProfileByPhone, type CustomerProfile } from '@/lib/mock-profiles'

interface ProfileSelectionProps {
  onComplete: (data: any) => void
  onBack: () => void
}

interface CustomerInfo {
  fullName: string
  cedula: string
  phoneNumber: string
  email: string
}

export function ProfileSelection({ onComplete, onBack }: ProfileSelectionProps) {
  const [step, setStep] = useState<'phone' | 'verify-code' | 'existing-profile' | 'new-registration'>('phone')
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [foundProfile, setFoundProfile] = useState<CustomerProfile | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // Validate and format phone
  const validatePhone = (phoneStr: string): boolean => {
    const cleaned = phoneStr.replace(/\D/g, '')
    if (cleaned.length < 10) {
      setErrors({ phone: 'Ingresa un número de teléfono válido' })
      return false
    }
    setErrors({})
    return true
  }

  // Step 1: Phone Input - Send Code
  const handleSendCode = () => {
    if (!validatePhone(phone)) return

    setLoading(true)
    // Simulate sending code
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedCode(code)
      setStep('verify-code')
      setLoading(false)
    }, 1500)
  }

  // Step 2: Verify Code and Check Profile
  const handleVerifyCode = () => {
    if (verificationCode !== generatedCode) {
      setErrors({ code: 'Código incorrecto. Intenta de nuevo.' })
      return
    }

    setErrors({})
    setLoading(true)

    // Simulate checking profile
    setTimeout(() => {
      const profile = getProfileByPhone(phone)
      
      if (profile) {
        // Existing customer
        setFoundProfile(profile)
        setStep('existing-profile')
      } else {
        // New customer
        setStep('new-registration')
      }
      setLoading(false)
    }, 1000)
  }

  // Use existing profile
  const handleUseProfile = (profile: CustomerProfile) => {
    onComplete({
      fullName: profile.fullName,
      cedula: profile.cedula,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      isExistingProfile: true,
      profileId: profile.id,
    })
  }

  // New user registration complete
  const handleNewUserComplete = (data: CustomerInfo) => {
    onComplete({
      ...data,
      isExistingProfile: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Phone Input */}
      {step === 'phone' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ingresa tu teléfono</h2>
              <p className="mt-2 text-muted-foreground">
                Verificaremos tu número para continuar
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Atrás
            </button>
          </div>

          <div className="space-y-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Número de Teléfono *
              </label>
              <input
                type="tel"
                placeholder="+58 (414) 123-4567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setErrors({})
                }}
                className={`w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Formato: +58 (414) 123-4567
              </p>
            </div>

            {/* Demo Info */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-900">
                <strong>Números disponibles:</strong> +58 (414) 123-4567, +58 (416) 987-6543, +58 (412) 555-8888
              </p>
            </div>

            {/* Send Code Button */}
            <button
              onClick={handleSendCode}
              disabled={!phone || loading}
              className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Enviando código...' : 'Enviar código de verificación'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Code Verification */}
      {step === 'verify-code' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Verifica tu código</h2>
              <p className="mt-2 text-muted-foreground">
                Hemos enviado un código a {phone}
              </p>
            </div>
            <button
              onClick={() => {
                setStep('phone')
                setVerificationCode('')
                setGeneratedCode('')
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Atrás
            </button>
          </div>

          <div className="space-y-4">
            {/* Code Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Código de verificación *
              </label>
              <input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setErrors({})
                }}
                maxLength={6}
                className={`w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-widest font-mono text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.code ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </div>

            {/* Demo Info - Show Code */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-900">
                <strong>Código de demostración:</strong> {generatedCode}
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || loading}
              className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar código'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Existing Profile Confirmation */}
      {step === 'existing-profile' && foundProfile && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Bienvenido de vuelta</h2>
              <p className="mt-2 text-muted-foreground">
                ¿Confirmas esta información?
              </p>
            </div>
            <button
              onClick={() => setStep('phone')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Atrás
            </button>
          </div>

          {/* Profile Card - Preselected */}
          <div className="rounded-lg border-2 border-green-400 bg-green-50 p-1">
            <div className="rounded-lg bg-card p-6">
              <div className="space-y-4">
                {/* Header with Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">✓</span>
                    <div>
                      <p className="text-xs font-medium text-green-700">PERFIL PRESELECCIONADO</p>
                      <p className="text-sm text-muted-foreground">Tus datos están listos</p>
                    </div>
                  </div>
                </div>

                {/* Name Section */}
                <div className="border-b border-border pb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">NOMBRE</p>
                  <p className="text-xl font-bold text-foreground">{foundProfile.fullName}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">CÉDULA</p>
                    <p className="font-semibold text-foreground">{foundProfile.cedula}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">TELÉFONO</p>
                    <p className="font-semibold text-foreground">{foundProfile.phoneNumber}</p>
                  </div>
                </div>

                {/* Email */}
                {foundProfile.email && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">CORREO</p>
                    <p className="font-semibold text-foreground">{foundProfile.email}</p>
                  </div>
                )}

                {/* Delivery Zone */}
                {foundProfile.defaultDeliveryZone && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">ZONA FAVORITA</p>
                    <p className="font-semibold text-foreground">{foundProfile.defaultDeliveryZone}</p>
                  </div>
                )}

                {/* Last Order */}
                {foundProfile.lastOrderDate && (
                  <div className="text-xs text-muted-foreground">
                    Último pedido: {new Date(foundProfile.lastOrderDate).toLocaleDateString('es-VE')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleUseProfile(foundProfile)}
              className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
            >
              Confirmar y Continuar
            </button>

            <button
              onClick={() => setStep('phone')}
              className="w-full rounded-lg border border-border bg-background py-3 font-bold text-foreground transition hover:bg-muted"
            >
              Cambiar número de teléfono
            </button>
          </div>
        </div>
      )}

      {/* Step 4: New Registration */}
      {step === 'new-registration' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Crea tu perfil</h2>
              <p className="mt-2 text-muted-foreground">
                Completa tu información para continuar
              </p>
            </div>
            <button
              onClick={() => setStep('phone')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Atrás
            </button>
          </div>

          {/* Show verified phone */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-xs text-green-900">
              <strong>Teléfono verificado:</strong> {phone}
            </p>
          </div>

          {/* Registration Form */}
          <CustomerInfoForm
            onComplete={handleNewUserComplete}
            onBack={() => setStep('phone')}
            showPhoneField={false}
            prefilledPhone={phone}
          />
        </div>
      )}
    </div>
  )
}
