'use client'

import { useState, useEffect } from 'react'
import { CustomerInfo } from '@/lib/mock-profiles'
import { User, Phone, Mail, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Venezuelan carrier prefixes
const VE_PREFIXES = [
  { value: '0412', label: '0412', carrier: 'Digitel' },
  { value: '0414', label: '0414', carrier: 'Movistar' },
  { value: '0416', label: '0416', carrier: 'Movistar' },
  { value: '0424', label: '0424', carrier: 'Movilnet' },
  { value: '0426', label: '0426', carrier: 'Movilnet' },
]

interface CustomerInfoFormProps {
  onComplete: (data: CustomerInfo) => void
  initialData?: CustomerInfo | null
}

type TouchedFields = Record<string, boolean>

function getFieldStatus(field: string, value: string, touched: boolean): 'idle' | 'valid' | 'error' {
  if (!touched && !value) return 'idle'
  switch (field) {
    case 'name':
      if (!value.trim()) return 'error'
      if (value.trim().length < 3) return 'error'
      return 'valid'
    case 'idNumber': {
      const raw = value.replace(/\D/g, '')
      if (!raw) return 'error'
      if (raw.length < 6) return 'error'
      return 'valid'
    }
    case 'phone': {
      const raw = value.replace(/\D/g, '')
      if (!raw) return 'error'
      if (raw.length < 11) return touched ? 'error' : 'idle'
      return 'valid'
    }
    case 'email':
      if (!value) return 'error'
      if (!/^\S+@\S+\.\S+$/.test(value)) return touched ? 'error' : 'idle'
      return 'valid'
    default:
      return 'idle'
  }
}

function getFieldError(field: string, value: string): string {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'El nombre es requerido'
      if (value.trim().length < 3) return 'Nombre muy corto'
      return ''
    case 'idNumber': {
      const raw = value.replace(/\D/g, '')
      if (!raw) return 'La cédula es requerida'
      if (raw.length < 6) return 'Cédula muy corta'
      return ''
    }
    case 'phone': {
      const raw = value.replace(/\D/g, '')
      if (!raw) return 'El teléfono es requerido'
      if (raw.length < 11) return 'Debe tener 11 dígitos (ej: 0414-1234567)'
      return ''
    }
    case 'email':
      if (!value) return 'El correo es requerido'
      if (value && !/^\S+@\S+\.\S+$/.test(value)) return 'Formato inválido (ej: nombre@gmail.com)'
      return ''
    default:
      return ''
  }
}

interface FieldWrapperProps {
  status: 'idle' | 'valid' | 'error'
  error: string
  children: React.ReactNode
}

function FieldFeedback({ status, error }: { status: 'idle' | 'valid' | 'error'; error: string }) {
  if (status === 'valid') {
    return (
      <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 px-1 mt-1 animate-fade-in">
        <CheckCircle2 className="h-3.5 w-3.5 field-success-icon shrink-0" />
        Correcto
      </p>
    )
  }
  if (status === 'error' && error) {
    return (
      <p className="flex items-center gap-1 text-xs text-destructive px-1 mt-1 animate-fade-in">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {error}
      </p>
    )
  }
  return null
}

export function CustomerInfoForm({ onComplete, initialData }: CustomerInfoFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    idType: 'V',
    idNumber: '',
    phone: '',
    email: '',
  })
  const [phonePrefix, setPhonePrefix] = useState('0414')
  const [phoneSuffix, setPhoneSuffix] = useState('')
  const [touched, setTouched] = useState<TouchedFields>({})

  // Helper: build combined phone string
  const buildPhone = (prefix: string, suffix: string) =>
    suffix ? `${prefix}-${suffix}` : ''

  useEffect(() => {
    if (initialData) {
      // Parse the phone first so we can set everything in one consistent state update
      let prefix = '0414'
      let suffix = ''
      if (initialData.phone) {
        const raw = initialData.phone.replace(/\D/g, '') // strip dashes / spaces
        const found = VE_PREFIXES.find(p => raw.startsWith(p.value.replace(/\D/g, '')))
        prefix = found?.value ?? '0414'
        suffix = raw.slice(4) // everything after the 4-digit prefix
      }

      setPhonePrefix(prefix)
      setPhoneSuffix(suffix)
      // Set formData with the correctly rebuilt phone in one shot — no race
      setFormData({
        ...initialData,
        phone: buildPhone(prefix, suffix),
      })
      const t: TouchedFields = {}
      Object.entries(initialData).forEach(([k, v]) => { if (v) t[k] = true })
      setTouched(t)
    }
  }, [initialData])

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Mark as touched on first keystroke (for real-time feedback)
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const nameStatus = getFieldStatus('name', formData.name, !!touched.name)
  const idStatus = getFieldStatus('idNumber', formData.idNumber, !!touched.idNumber)
  const phoneStatus = getFieldStatus('phone', formData.phone, !!touched.phone)
  const emailStatus = getFieldStatus('email', formData.email || '', !!touched.email)

  const handleSubmit = () => {
    // Touch all fields to reveal errors
    setTouched({ name: true, idNumber: true, phone: true, email: true })

    const isValid =
      nameStatus === 'valid' &&
      idStatus === 'valid' &&
      phoneStatus === 'valid' &&
      emailStatus === 'valid'

    if (isValid) {
      onComplete(formData)
    }
  }

  return (
    <div className="space-y-5">
      <div className="card-premium p-4 sm:p-6 space-y-5">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
          <User className="h-5 w-5 text-primary" />
          Tus datos personales
        </h3>

        {/* Nombre Completo */}
        <div className="space-y-0.5">
          <div className="floating-label-group relative">
            <input
              type="text"
              placeholder=" "
              className={cn(
                'input-premium pr-10',
                formData.name && 'has-value',
                nameStatus === 'error' && touched.name && 'error',
                nameStatus === 'valid' && 'success'
              )}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            <label>Nombre y Apellido</label>
            {/* Inline status icon */}
            {nameStatus === 'valid' && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 field-success-icon pointer-events-none" />
            )}
            {nameStatus === 'error' && touched.name && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none animate-fade-in" />
            )}
          </div>
          <FieldFeedback status={touched.name ? nameStatus : 'idle'} error={getFieldError('name', formData.name)} />
        </div>

        {/* Cédula */}
        <div className="space-y-0.5">
          <div className="flex gap-2">
            <div className="w-24 shrink-0">
              <select
                className="select-premium font-semibold"
                value={formData.idType}
                onChange={(e) => handleChange('idType', e.target.value)}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="J">J</option>
              </select>
            </div>
            <div className="flex-1 floating-label-group relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder=" "
                className={cn(
                  'input-premium pr-10',
                  formData.idNumber && 'has-value',
                  idStatus === 'error' && touched.idNumber && 'error',
                  idStatus === 'valid' && 'success'
                )}
                value={formData.idNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  const formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  handleChange('idNumber', formatted)
                }}
                onBlur={() => handleBlur('idNumber')}
              />
              <label>Cédula o RIF</label>
              {idStatus === 'valid' && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 field-success-icon pointer-events-none" />
              )}
              {idStatus === 'error' && touched.idNumber && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none animate-fade-in" />
              )}
            </div>
          </div>
          <FieldFeedback status={touched.idNumber ? idStatus : 'idle'} error={getFieldError('idNumber', formData.idNumber)} />
        </div>

        {/* Teléfono con selector de operadora */}
        <div className="space-y-0.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1 flex items-center gap-1.5">
            <Phone className="h-3 w-3" /> Teléfono (WhatsApp)
          </label>
          <div className="flex gap-2">
            {/* Carrier prefix selector */}
            <div className="relative shrink-0">
              <select
                value={phonePrefix}
                onChange={(e) => {
                  const newPrefix = e.target.value
                  setPhonePrefix(newPrefix)
                  setFormData(prev => ({ ...prev, phone: buildPhone(newPrefix, phoneSuffix) }))
                }}
                className="select-premium !w-[100px] font-bold text-sm appearance-none pr-7"
              >
                {VE_PREFIXES.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.value}
                  </option>
                ))}
              </select>
            </div>
            {/* Suffix: 7 digits */}
            <div className="relative flex-1">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="000 0000"
                maxLength={8}
                className={cn(
                  'input-premium pr-10 tracking-wider',
                  phoneSuffix && 'has-value',
                  phoneStatus === 'error' && touched.phone && 'error',
                  phoneStatus === 'valid' && 'success'
                )}
                value={phoneSuffix}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 7)
                  setPhoneSuffix(digits)
                  setFormData(prev => ({ ...prev, phone: buildPhone(phonePrefix, digits) }))
                  if (digits && !touched.phone) {
                    setTouched(prev => ({ ...prev, phone: true }))
                  }
                }}
                onBlur={() => handleBlur('phone')}
              />
              {phoneStatus === 'valid' && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 field-success-icon pointer-events-none" />
              )}
              {phoneStatus === 'error' && touched.phone && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none animate-fade-in" />
              )}
              {/* Digit counter */}
              {phoneSuffix.length > 0 && phoneSuffix.length < 7 && (
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground pointer-events-none">
                  {7 - phoneSuffix.length} más
                </span>
              )}
            </div>
          </div>
          {/* Carrier label */}
          <p className="text-[11px] text-muted-foreground ml-1 mt-1">
            {VE_PREFIXES.find(p => p.value === phonePrefix)?.carrier} · {phonePrefix}
          </p>
          <FieldFeedback status={touched.phone ? phoneStatus : 'idle'} error={getFieldError('phone', formData.phone)} />
        </div>

        {/* Email */}
        <div className="space-y-0.5">
          <div className="floating-label-group relative">
            <input
              type="email"
              inputMode="email"
              placeholder=" "
              className={cn(
                'input-premium pr-10',
                formData.email && 'has-value',
                emailStatus === 'error' && touched.email && 'error',
                emailStatus === 'valid' && 'success'
              )}
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            <label>Correo electrónico</label>
            {emailStatus === 'valid' && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 field-success-icon pointer-events-none" />
            )}
            {emailStatus === 'error' && touched.email && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none animate-fade-in" />
            )}
          </div>
          <FieldFeedback status={touched.email ? emailStatus : 'idle'} error={getFieldError('email', formData.email || '')} />
        </div>
      </div>

      <button
        id="submit-step-btn"
        onClick={handleSubmit}
        className="hidden"
      >
        Continuar al Pago
      </button>
    </div>
  )
}
