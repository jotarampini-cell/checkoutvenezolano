export interface DeliveryZone {
  id: string
  name: string
  cost: number
}

export interface DeliveryCity {
  id: string
  name: string
  zones: DeliveryZone[]
}

export interface StoreConfig {
  name: string
  delivery: {
    cities: DeliveryCity[]
  }
}

// Configuración de la tienda para el delivery local
export const STORE_CONFIG: StoreConfig = {
  name: "Mi Tienda",
  delivery: {
    cities: [
      {
        id: "caracas",
        name: "Caracas",
        zones: [
          { id: "chacao", name: "Chacao", cost: 2 },
          { id: "altamira", name: "Altamira", cost: 2 },
          { id: "los-palos-grandes", name: "Los Palos Grandes", cost: 2 },
          { id: "las-mercedes", name: "Las Mercedes", cost: 4 },
          { id: "el-rosal", name: "El Rosal", cost: 4 },
          { id: "bello-monte", name: "Bello Monte", cost: 4 },
          { id: "la-castellana", name: "La Castellana", cost: 4 },
          { id: "la-florida", name: "La Florida", cost: 5 },
          { id: "los-ruices", name: "Los Ruices", cost: 5 },
          { id: "macaracuay", name: "Macaracuay", cost: 6 }
        ]
      },
      {
        id: "valencia",
        name: "Valencia",
        zones: [
          { id: "san-diego", name: "San Diego", cost: 3 },
          { id: "naguanagua", name: "Naguanagua", cost: 4 },
          { id: "el-trigal", name: "El Trigal", cost: 4 },
          { id: "isabelica", name: "La Isabelica", cost: 5 }
        ]
      }
    ]
  }
}
