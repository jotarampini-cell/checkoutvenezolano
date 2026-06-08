// Mock customer profiles for demonstration
export interface CustomerProfile {
  id: string
  fullName: string
  cedula: string
  phoneNumber: string
  email: string
  defaultDeliveryZone?: string
  lastOrderDate?: string
}

export const mockProfiles: CustomerProfile[] = [
  {
    id: 'profile-1',
    fullName: 'María González López',
    cedula: '12.345.678',
    phoneNumber: '+58 (414) 123-4567',
    email: 'maria.gonzalez@email.com',
    defaultDeliveryZone: 'Chacao',
    lastOrderDate: '2024-05-15',
  },
  {
    id: 'profile-2',
    fullName: 'Carlos Martínez Rodríguez',
    cedula: '18.765.432',
    phoneNumber: '+58 (416) 987-6543',
    email: 'carlos.martinez@email.com',
    defaultDeliveryZone: 'Baruta',
    lastOrderDate: '2024-05-20',
  },
  {
    id: 'profile-3',
    fullName: 'Ana Díaz Fernández',
    cedula: '24.111.222',
    phoneNumber: '+58 (412) 555-8888',
    email: 'ana.diaz@email.com',
    defaultDeliveryZone: 'El Hatillo',
    lastOrderDate: '2024-05-18',
  },
]

// Function to get profile by ID
export function getProfileById(id: string): CustomerProfile | undefined {
  return mockProfiles.find((profile) => profile.id === id)
}

// Function to get profile by phone number
export function getProfileByPhone(phone: string): CustomerProfile | undefined {
  return mockProfiles.find((profile) => profile.phoneNumber.replace(/\D/g, '') === phone.replace(/\D/g, ''))
}
