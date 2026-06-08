'use client'

import { useState } from 'react'

interface CustomerInfo {
  fullName: string
  cedula: string
  phoneNumber: string
  email: string
}

interface CustomerInfoFormProps {
  onComplete: (data: CustomerInfo) => void
  onBack: () => void
  showPhoneField?: boolean
  prefilledPhone?: string
}

export function CustomerInfoForm({ 
  onComplete, 
  onBack, 
  showPhoneField = true,
  prefilledPhone = ''
}: CustomerInfoFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    cedula: '',
    phoneNumber: prefilledPhone,
    email: '',
  })

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const validateForm = () => {
    const newErrors: Partial<CustomerInfo> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido'
    }

    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida'
    } else if (!/^\d{6,8}$/.test(formData.cedula.replace(/[.-]/g, ''))) {
      newErrors.cedula = 'Cédula inválida (6-8 dígitos)'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El teléfono es requerido'
    } else if (!/^[0-9+\-\s()]{10,20}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Teléfono inválido'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete(formData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tu Información</h2>
          <p className="mt-2 text-muted-foreground">
            Necesitamos estos datos para procesar tu pedido
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Atrás
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nombre Completo *
          </label>
          <input
            type="text"
            placeholder="Juan Carlos Pérez"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.fullName ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Cedula */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Cédula de Identidad *
          </label>
          <input
            type="text"
            placeholder="12.345.678 o 12345678"
            value={formData.cedula}
            onChange={(e) => handleChange('cedula', e.target.value)}
            className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.cedula ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.cedula && (
            <p className="text-xs text-red-500">{errors.cedula}</p>
          )}
          <p className="text-xs text-muted-foreground">Formato: 12.345.678 o sin puntos</p>
        </div>

        {/* Phone Number */}
        {showPhoneField && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Número de Teléfono *
            </label>
            <input
              type="tel"
              placeholder="+58 (414) 123-4567 o 02121234567"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.phoneNumber ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500">{errors.phoneNumber}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Incluyendo el código de país (+58)
            </p>
          </div>
        )}
        {!showPhoneField && prefilledPhone && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Número de Teléfono
            </label>
            <div className="rounded-lg border border-border bg-muted px-4 py-2 text-foreground">
              {prefilledPhone}
            </div>
            <p className="text-xs text-muted-foreground">
              Verificado con código SMS
            </p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Correo Electrónico (Opcional)
          </label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Para recibir confirmación y seguimiento por correo
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs text-blue-900">
            <strong>ℹ️ Privacidad:</strong> Tu información está protegida y solo
            será usada para procesar tu pedido. No la compartimos con terceros.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90"
        >
          Continuar
        </button>
      </form>
    </div>
  )
}
