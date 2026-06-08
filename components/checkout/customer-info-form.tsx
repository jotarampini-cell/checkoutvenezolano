'use client'

import { useState, useEffect } from 'react'
import { CustomerInfo } from '@/lib/mock-profiles'
import { User, CreditCard, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomerInfoFormProps {
  onComplete: (data: CustomerInfo) => void
  initialData?: CustomerInfo | null
}

export function CustomerInfoForm({ onComplete, initialData }: CustomerInfoFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    idType: 'V',
    idNumber: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const validateField = (field: keyof CustomerInfo, value: string) => {
    let error = ''
    switch (field) {
      case 'name':
        if (!value.trim()) error = 'El nombre es requerido'
        break
      case 'idNumber': {
        const rawId = value.replace(/\D/g, '')
        if (!rawId) error = 'La cédula es requerida'
        else if (rawId.length < 6) error = 'Cédula muy corta'
        break
      }
      case 'phone': {
        const rawPhone = value.replace(/\D/g, '')
        if (!rawPhone) error = 'El teléfono es requerido'
        else if (rawPhone.length < 11) error = 'Debe tener 11 dígitos'
        break
      }
      case 'email':
        if (value && !/^\S+@\S+\.\S+$/.test(value)) error = 'Email inválido'
        break
    }
    setErrors(prev => ({ ...prev, [field]: error }))
    return !error
  }

  const handleBlur = (field: keyof CustomerInfo) => {
    validateField(field, formData[field] || '')
  }

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = () => {
    const isNameValid = validateField('name', formData.name)
    const isIdValid = validateField('idNumber', formData.idNumber)
    const isPhoneValid = validateField('phone', formData.phone)
    const isEmailValid = validateField('email', formData.email || '')

    if (isNameValid && isIdValid && isPhoneValid && isEmailValid) {
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
        <div className="space-y-1">
          <div className="floating-label-group">
            <input
              type="text"
              placeholder=" "
              className={cn("input-premium", formData.name && "has-value", errors.name && "error")}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            <label>Nombre y Apellido</label>
          </div>
          {errors.name && <p className="text-xs text-destructive px-1">{errors.name}</p>}
        </div>

        {/* Cédula */}
        <div className="space-y-1">
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
            <div className="flex-1 floating-label-group">
              <input
                type="text"
                inputMode="numeric"
                placeholder=" "
                className={cn("input-premium", formData.idNumber && "has-value", errors.idNumber && "error")}
                value={formData.idNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  const formatted = val.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                  handleChange('idNumber', formatted)
                }}
                onBlur={() => handleBlur('idNumber')}
              />
              <label>Cédula o RIF</label>
            </div>
          </div>
          {errors.idNumber && <p className="text-xs text-destructive px-1">{errors.idNumber}</p>}
        </div>

        {/* Teléfono */}
        <div className="space-y-1">
          <div className="floating-label-group">
            <input
              type="tel"
              inputMode="tel"
              placeholder=" "
              className={cn("input-premium", formData.phone && "has-value", errors.phone && "error")}
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                let formatted = val
                if (val.length > 4) {
                  formatted = `${val.slice(0, 4)}-${val.slice(4, 11)}`
                }
                handleChange('phone', formatted)
              }}
              onBlur={() => handleBlur('phone')}
            />
            <label>Teléfono (WhatsApp)</label>
          </div>
          {errors.phone && <p className="text-xs text-destructive px-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <div className="floating-label-group">
            <input
              type="email"
              inputMode="email"
              placeholder=" "
              className={cn("input-premium", formData.email && "has-value", errors.email && "error")}
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            <label>Correo electrónico (Opcional)</label>
          </div>
          {errors.email && <p className="text-xs text-destructive px-1">{errors.email}</p>}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="btn-primary"
      >
        Continuar al Pago
      </button>
    </div>
  )
}
