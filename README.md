# CipherSphere

A modern web application for text encryption and decryption using multiple cipher algorithms, built with Next.js 14, Tailwind CSS, and Prisma with PostgreSQL.

## Features

### 🔐 Authentication System
- User registration with validation (username ≥ 6 chars, password ≥ 8 chars with letters, numbers, and special characters)
- Login with 3 failed attempts protection before account blocking
- Session-based authentication using JWT tokens

### 🔑 Cipher Tools
- **ATBASH Cipher**: Simple substitution cipher that reverses the alphabet
- **Caesar Cipher**: Classic shift cipher with customizable shift values (0-25)
- **Vigenère Cipher**: Polyalphabetic cipher using a keyword for encryption/decryption

### 📱 QR Code Generation
- Automatic QR code generation for all cipher results
- Download QR codes as PNG images
- Display QR codes directly in the interface

### 📚 History Tracking
- Save all encryption/decryption operations
- View complete history with pagination
- Copy results and download QR codes from history

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Dashboard layout with sidebar navigation
- Mobile-friendly interface
- Real-time feedback and error handling

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM (optimized for NeonDB)
- **Authentication**: JWT tokens with HTTP-only cookies
- **QR Codes**: qrcode library
- **Icons**: Heroicons

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (recommend NeonDB for cloud hosting)
- Git

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd my-app
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database (Replace with your NeonDB connection string)
DATABASE_URL="postgresql://username:password@host:5432/ciphersphere?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# App Configuration
APP_ENV="development"
```

### 3. Database Setup

#### For NeonDB (Recommended):
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project named "ciphersphere"
3. Copy the connection string and replace `DATABASE_URL` in your `.env` file

#### Generate Prisma Client and Run Migrations:
```bash
npx prisma generate
npx prisma db push
```

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Database Schema

The application uses two main models:

### Users Table
- `id`: Unique identifier
- `username`: User's chosen username (unique, min 6 chars)
- `passwordHash`: Bcrypt hashed password
- `failedAttempts`: Counter for failed login attempts
- `blocked`: Boolean flag for account blocking
- `role`: User role (USER/ADMIN)
- `createdAt`/`updatedAt`: Timestamps

### Cipher History Table
- `id`: Unique identifier
- `userId`: Reference to user
- `method`: Cipher type (ATBASH/CAESAR/VIGENERE)
- `inputText`: Original text
- `outputText`: Encrypted/decrypted result
- `key`: Cipher key (null for ATBASH)
- `qrCodeData`: Base64 encoded QR code image
- `createdAt`: Timestamp

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/cipher` - Encrypt/decrypt text
- `GET /api/history` - Get user's cipher history

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies for session management
- Account lockout after failed attempts
- Input validation and sanitization
- CORS protection

## File Structure

```
my-app/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── history/          # History page
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                # Utility libraries
│   ├── auth.ts         # Authentication utilities
│   ├── ciphers.ts      # Cipher algorithms
│   ├── db.ts          # Database connection
│   └── qrcode.ts      # QR code utilities
├── prisma/             # Database schema
└── middleware.ts       # Authentication middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open database browser
- `npx prisma db push` - Push schema changes to database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## License

This project is licensed under the MIT License.
