# Demo Profiles for Phone Verification Testing

This document describes the mock customer profiles available for testing the phone verification and profile loading features.

## Available Profiles

### Profile 1: María González López
**Quick Access Code:** `+58 (414) 123-4567`

- **Full Name:** María González López
- **ID (Cédula):** 12.345.678
- **Phone:** +58 (414) 123-4567
- **Email:** maria.gonzalez@email.com
- **Favorite Zone:** Chacao
- **Last Order:** May 15, 2024
- **Use Case:** Returning customer from Chacao area with delivery history

### Profile 2: Carlos Martínez Rodríguez
**Quick Access Code:** `+58 (416) 987-6543`

- **Full Name:** Carlos Martínez Rodríguez
- **ID (Cédula):** 18.765.432
- **Phone:** +58 (416) 987-6543
- **Email:** carlos.martinez@email.com
- **Favorite Zone:** Baruta
- **Last Order:** May 20, 2024
- **Use Case:** Frequent customer from Baruta with recent purchase

### Profile 3: Ana Díaz Fernández
**Quick Access Code:** `+58 (412) 555-8888`

- **Full Name:** Ana Díaz Fernández
- **ID (Cédula):** 24.111.222
- **Phone:** +58 (412) 555-8888
- **Email:** ana.diaz@email.com
- **Favorite Zone:** El Hatillo
- **Last Order:** May 18, 2024
- **Use Case:** Customer from El Hatillo area with mid-cycle order

## How to Use These Profiles

### Testing Existing Customer Flow

1. **Start Checkout:** Click on any delivery mode (Delivery Local, Envío Nacional, or Retiro en Tienda)
2. **Select "Cliente Existente"** (Existing Customer)
3. **Enter Phone Number:** Copy one of the phone numbers from above (e.g., `+58 (414) 123-4567`)
4. **Verify Code:** Click "Enviar Código por WhatsApp"
5. **View Generated Code:** The system will display a mock verification code (6 digits)
6. **Enter Code:** Type the displayed code in the verification field
7. **Profile Auto-Loads:** The customer profile will automatically appear with all pre-filled information
8. **Confirm Profile:** Click "Usar esta información" to proceed with the loaded profile

### Testing New Registration Flow

1. **Start Checkout:** Click on any delivery mode
2. **Select "Nuevo Registro"** (New Registration)
3. **Phone Verification:** System may ask for phone verification (depending on flow)
4. **Fill Registration Form:** 
   - Enter a new name
   - Enter a new ID number
   - Enter optional email
   - Note: Phone field won't appear (it was verified in previous step)
5. **Continue:** Proceed to delivery details

## Mock Verification Code

When you send a verification code, the system generates a **random 6-digit code** for demonstration purposes.

**Example:** If you see the message "Tu código de verificación es: 240275", you should enter `240275` in the code field.

## Customizing Profiles

To add, modify, or remove mock profiles:

1. **Location:** `/lib/mock-profiles.ts`
2. **Edit the `mockProfiles` array** with your desired customer data
3. **Syntax Example:**
```typescript
{
  id: 'profile-4',
  fullName: 'Your Name Here',
  cedula: '25.123.456',
  phoneNumber: '+58 (412) 123-4567',
  email: 'email@example.com',
  defaultDeliveryZone: 'Chacao',
  lastOrderDate: '2024-05-15',
}
```

## Linking Phone Numbers to Profiles

The system uses `getProfileByPhone()` to match entered phone numbers to existing profiles. The matching:

- **Strips all non-digits** from both the input and stored phone numbers
- **Compares the digit sequences** to find matches
- **Supports multiple formats:** `+58 (414) 123-4567`, `+584141234567`, `04141234567`, etc.

### Example Matching:
- User enters: `+58 (414) 123-4567`
- Stored as: `+58 (414) 123-4567`
- System extracts digits: `584141234567` = `584141234567` ✓ **MATCH**

## Creating a Real Backend

To migrate from mock to real profiles:

1. **Create Database Schema:**
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  default_delivery_zone VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_order_date TIMESTAMP
);

CREATE TABLE verification_codes (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Implement Backend Functions:**
- `POST /api/verify-phone` - Send verification code
- `POST /api/verify-code` - Verify the entered code
- `GET /api/profile/:phone` - Get customer profile by phone
- `POST /api/register` - Create new customer profile

3. **Update Components:**
- Replace mock code generation with real SMS/WhatsApp API
- Replace profile lookup with database queries
- Add proper error handling and edge cases

## Notes

- All profiles are **fictional** for demonstration purposes
- Verification codes are **randomly generated** and visible in the UI for demo convenience
- In production, codes should be **sent via WhatsApp Business API** (Twilio, Meta)
- Phone matching supports **multiple format variations** for better UX
- The system can handle **unlimited custom profiles** by editing the mock file
