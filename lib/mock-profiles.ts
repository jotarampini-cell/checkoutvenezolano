// Mock customer profiles for demonstration
export interface CustomerInfo {
  name: string
  idType: string
  idNumber: string
  phone: string
  email: string
}

export const mockProfiles: CustomerInfo[] = [
  {
    name: 'María González López',
    idType: 'V',
    idNumber: '12345678',
    phone: '04141234567',
    email: 'maria.gonzalez@email.com',
  },
  {
    name: 'Carlos Martínez Rodríguez',
    idType: 'V',
    idNumber: '18765432',
    phone: '04169876543',
    email: 'carlos.martinez@email.com',
  },
]

// Function to get profile by phone number
export function getProfileByPhone(phone: string): CustomerInfo | undefined {
  return mockProfiles.find((profile) => profile.phone === phone.replace(/\D/g, ''))
}
