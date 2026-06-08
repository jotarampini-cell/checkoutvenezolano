'use client'

interface PaymentOptionSelectorProps {
  onSelect: (option: string) => void
  selected: string | null
}

export function PaymentOptionSelector({ onSelect, selected }: PaymentOptionSelectorProps) {
  const options = [
    {
      id: 'online',
      title: 'Pago Anticipado',
      description: 'Paga online antes de retirar tu pedido',
      icon: '💳',
    },
    {
      id: 'instore',
      title: 'Pago en Tienda',
      description: 'Paga cuando retires tu pedido',
      icon: '💵',
    },
  ]

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`w-full rounded-lg border-2 p-4 text-left transition ${
            selected === option.id
              ? 'border-primary bg-accent'
              : 'border-border hover:border-primary'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{option.icon}</span>
            <div>
              <div className="font-bold text-foreground">{option.title}</div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
