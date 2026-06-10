'use client'

import { useState, useRef } from 'react'
import { MapPin } from 'lucide-react'

interface LocationCascadeProps {
  onSelect: (state: string, city: string, branch: string) => void
  transport: string | null
}

const STATES = ['Distrito Capital', 'Miranda', 'Carabobo', 'Zulia', 'Lara', 'Aragua']
const CITIES: Record<string, string[]> = {
  'Distrito Capital': ['Caracas'],
  'Miranda': ['Los Teques', 'Guarenas', 'Guatire', 'San Antonio'],
  'Carabobo': ['Valencia', 'Puerto Cabello', 'Guacara'],
  'Zulia': ['Maracaibo', 'San Francisco', 'Cabimas'],
  'Lara': ['Barquisimeto', 'Cabudare', 'Carora'],
  'Aragua': ['Maracay', 'Cagua', 'Turmero']
}

export function LocationCascade({ onSelect, transport }: LocationCascadeProps) {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [branch, setBranch] = useState('')
  
  const cityRef = useRef<HTMLDivElement>(null)
  const branchRef = useRef<HTMLDivElement>(null)

  const handleStateChange = (val: string) => {
    setState(val)
    setCity('')
    setBranch('')
    setTimeout(() => {
      cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }

  const handleCityChange = (val: string) => {
    setCity(val)
    setBranch('')
    setTimeout(() => {
      branchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)
  }

  const handleBranchChange = (val: string) => {
    setBranch(val)
    if (state && city && val) {
      onSelect(state, city, val)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <select 
          className="select-premium"
          value={state}
          onChange={(e) => handleStateChange(e.target.value)}
        >
          <option value="" disabled>Selecciona el Estado</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {state && (
        <div ref={cityRef} className="animate-fade-up scroll-mt-4">
          <select 
            className="select-premium"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
          >
            <option value="" disabled>Selecciona la Ciudad</option>
            {CITIES[state]?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {city && (
        <div ref={branchRef} className="animate-fade-up scroll-mt-4">
          <select 
            className="select-premium"
            value={branch}
            onChange={(e) => handleBranchChange(e.target.value)}
          >
            <option value="" disabled>Selecciona la Sucursal de {transport || 'envío'}</option>
            <option value="Principal Centro">Principal Centro</option>
            <option value="Sucursal Norte">Sucursal Norte</option>
            <option value="Agencia Este">Agencia Este</option>
          </select>
        </div>
      )}
      
      {state && city && branch && (
        <div className="flex items-center gap-2 mt-2 text-xs font-medium text-success animate-fade-in px-1">
          <MapPin className="h-3 w-3" />
          Destino configurado correctamente
        </div>
      )}
    </div>
  )
}
