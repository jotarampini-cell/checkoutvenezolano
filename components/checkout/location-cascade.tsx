'use client'

import { useState, useMemo } from 'react'

interface LocationCascadeProps {
  onSelect: (state: string, city: string, branch: string) => void
  transport?: string | null
}

export function LocationCascade({ onSelect, transport }: LocationCascadeProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)

  const states = [
    'Amazonas',
    'Anzoátegui',
    'Apure',
    'Aragua',
    'Barinas',
    'Bolívar',
    'Carabobo',
    'Cojedes',
    'Delta Amacuro',
    'Falcón',
    'Guárico',
    'Lara',
    'Mérida',
    'Miranda',
    'Monagas',
    'Nueva Esparta',
    'Portuguesa',
    'Sucre',
    'Táchira',
    'Trujillo',
    'Vargas',
    'Yaracuy',
    'Zulia',
  ]

  const cityMap: Record<string, string[]> = {
    'Nueva Esparta': ['Porlamar', 'Juan Griego', 'Pampatar'],
    'Zulia': ['Maracaibo', 'Cabimas', 'Ciudad de Ojeda'],
    'Aragua': ['Maracay', 'La Victoria', 'Cagua'],
    'Carabobo': ['Valencia', 'Puerto Cabello', 'San Diego'],
    'Bolívar': ['Ciudad Bolívar', 'Puerto Ordaz', 'Upata'],
  }

  const branchMap: Record<string, Record<string, string[]>> = {
    'Nueva Esparta': {
      'Porlamar': ['Sucursal Centro', 'Sucursal Este'],
      'Juan Griego': ['Sucursal Principal'],
    },
    'Zulia': {
      'Maracaibo': ['Sucursal Centro', 'Sucursal Norte'],
      'Cabimas': ['Sucursal Principal'],
    },
  }

  const availableCities = useMemo(() => {
    if (!selectedState) return []
    return cityMap[selectedState] || ['Centro', 'Otros']
  }, [selectedState])

  const availableBranches = useMemo(() => {
    if (!selectedState || !selectedCity) return []
    const branches = branchMap[selectedState]?.[selectedCity]
    if (branches) return branches
    return [`${selectedCity} - Sucursal Principal`, `${selectedCity} - Sucursal Adicional`]
  }, [selectedState, selectedCity])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedCity(null)
    setSelectedBranch(null)
  }

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    setSelectedBranch(null)
  }

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch)
  }

  const handleConfirm = () => {
    if (selectedState && selectedCity && selectedBranch) {
      onSelect(selectedState, selectedCity, selectedBranch)
    }
  }

  const isComplete = selectedState && selectedCity && selectedBranch

  return (
    <div className="space-y-4">
      {/* State Selection */}
      <div>
        <label className="text-sm font-medium text-foreground">Estado</label>
        <select
          value={selectedState || ''}
          onChange={(e) => handleStateChange(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        >
          <option value="">Selecciona un estado</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* City Selection */}
      {selectedState && (
        <div>
          <label className="text-sm font-medium text-foreground">Ciudad</label>
          <select
            value={selectedCity || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="">Selecciona una ciudad</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Branch Selection */}
      {selectedCity && (
        <div>
          <label className="text-sm font-medium text-foreground">Sucursal receptora</label>
          <select
            value={selectedBranch || ''}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          >
            <option value="">Selecciona una sucursal</option>
            {availableBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Confirm Button */}
      {isComplete && (
        <button
          onClick={handleConfirm}
          className="w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground transition hover:opacity-90"
        >
          Confirmar Ubicación de Envío
        </button>
      )}
    </div>
  )
}
