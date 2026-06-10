'use client'

import { useState, useRef } from 'react'
import { Shield, MessageCircle, X, CheckCircle2 } from 'lucide-react'
import { CustomerInfoForm } from './customer-info-form'
import { getProfileByPhone, type CustomerInfo } from '@/lib/mock-profiles'
import { cn } from '@/lib/utils'

const VE_PREFIXES = [
  { value: '0412', label: '0412', carrier: 'Digitel' },
  { value: '0414', label: '0414', carrier: 'Movistar' },
  { value: '0416', label: '0416', carrier: 'Movistar' },
  { value: '0424', label: '0424', carrier: 'Movilnet' },
  { value: '0426', label: '0426', carrier: 'Movilnet' },
]

interface ProfileSelectionProps {
  onComplete: (data: CustomerInfo) => void
  onBack?: () => void
}

// OTP input with 4 separate boxes
function OTPInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.split('').slice(0, 4)

  const handleKey = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits]
      if (newDigits[index]) {
        newDigits[index] = ''
        onChange(newDigits.join(''))
      } else if (index > 0) {
        newDigits[index - 1] = ''
        onChange(newDigits.join(''))
        inputs.current[index - 1]?.focus()
      }
    }
  }

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    const newValue = newDigits.join('')
    onChange(newValue)
    if (digit && index < 3) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    onChange(pasted)
    inputs.current[Math.min(pasted.length, 3)]?.focus()
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            onPaste={handlePaste}
            className={cn(
              "otp-input",
              digits[i] && "filled",
              error && "!border-destructive"
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  )
}

export function ProfileSelection({ onComplete }: ProfileSelectionProps) {
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verifyPrefix, setVerifyPrefix] = useState('0414')
  const [verifySuffix, setVerifySuffix] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyStep, setVerifyStep] = useState<'phone' | 'code'>('phone')
  const [verifyError, setVerifyError] = useState('')
  const [loading, setLoading] = useState(false)
  const [prefilledData, setPrefilledData] = useState<CustomerInfo | null>(null)
  const [verifiedName, setVerifiedName] = useState<string | null>(null)

  // Full phone number for lookup
  const verifyPhone = verifySuffix ? `${verifyPrefix}${verifySuffix}` : ''

  const handleSendCode = async () => {
    if (verifySuffix.length < 7) {
      setVerifyError('Ingresa los 7 dígitos del número')
      return
    }
    setVerifyError('')
    setLoading(true)
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
    await new Promise(r => setTimeout(r, 1000))

    let profile = getProfileByPhone(verifyPhone)

    if (verifyCode === '1234') {
      profile = {
        name: 'Carlos Rodríguez',
        idType: 'V',
        idNumber: '12345678',
        phone: verifyPhone || '04141234567',
        email: 'carlos@prueba.com'
      }
    }

    if (profile) {
      setPrefilledData(profile)
      setVerifiedName(profile.name.split(' ')[0])
      setShowVerificationModal(false)
      setVerifyStep('phone')
      setVerifyPrefix('0414')
      setVerifySuffix('')
      setVerifyCode('')
    } else {
      setVerifyError('Código incorrecto o expirado')
    }
    setLoading(false)
  }

  // Auto-verify when 4 digits entered
  const handleCodeChange = (code: string) => {
    setVerifyCode(code)
    setVerifyError('')
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

      {/* Personalized welcome banner */}
      {prefilledData && verifiedName && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 animate-fade-down flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0 text-lg">
            {verifiedName[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              ¡Bienvenido de nuevo, {verifiedName}! 👋
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
              Tus datos fueron precargados desde tu cuenta verificada.
            </p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 ml-auto" />
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
              <p className="text-sm text-muted-foreground mt-1">
                {verifyStep === 'phone'
                  ? 'Te enviaremos un código por WhatsApp'
                  : `Código enviado al ${verifyPhone}`
                }
              </p>
            </div>

            {verifyStep === 'phone' ? (
              <div className="space-y-4">
                {/* Carrier prefix + suffix — same pattern as main form */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    Número de WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={verifyPrefix}
                      onChange={(e) => { setVerifyPrefix(e.target.value); setVerifyError('') }}
                      className="select-premium !w-[100px] font-bold text-sm"
                    >
                      {VE_PREFIXES.map(p => (
                        <option key={p.value} value={p.value}>{p.value}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="000 0000"
                      maxLength={7}
                      className={cn(
                        "input-premium flex-1 tracking-wider",
                        verifySuffix && "has-value",
                        verifyError && "error"
                      )}
                      value={verifySuffix}
                      onChange={(e) => {
                        setVerifySuffix(e.target.value.replace(/\D/g, '').slice(0, 7))
                        setVerifyError('')
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {VE_PREFIXES.find(p => p.value === verifyPrefix)?.carrier} · {verifyPrefix}
                    {verifySuffix.length > 0 && verifySuffix.length < 7 && (
                      <span className="ml-2 font-bold text-primary">{7 - verifySuffix.length} dígitos más</span>
                    )}
                  </p>
                </div>
                {verifyError && <p className="text-xs text-destructive">{verifyError}</p>}

                <button
                  onClick={handleSendCode}
                  disabled={loading || verifySuffix.length < 7}
                  className="btn-primary w-full"
                >
                  {loading ? <div className="spinner" /> : "Enviar código"}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 4-box OTP */}
                <OTPInput
                  value={verifyCode}
                  onChange={handleCodeChange}
                  error={verifyError}
                />

                <button
                  onClick={handleVerifyCode}
                  disabled={loading || verifyCode.length < 4}
                  className="btn-primary w-full"
                >
                  {loading ? <div className="spinner" /> : "Verificar y continuar"}
                </button>
                <button
                  onClick={() => setVerifyStep('phone')}
                  className="w-full text-xs text-muted-foreground font-medium hover:text-primary transition-colors text-center"
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
