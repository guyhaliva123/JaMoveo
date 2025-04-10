# Ja-Moveo

A real-time music collaboration platform built with Next.js, Socket.io, and Prisma.

## Project Overview

Ja-Moveo is a web application that allows musicians to collaborate in real-time. The platform supports different instruments including drums, guitar, bass, saxophone, keyboard, and vocals. Users can register, log in, and join live music sessions where they can play together with other musicians.

## Features

- **User Authentication**: Complete authentication system with login and signup functionality
- **Real-time Collaboration**: Live music sessions using Socket.io
- **Role-based Access**: Different roles (Admin, Regular) with appropriate permissions
- **Instrument Selection**: Users can select their preferred instrument
- **Responsive UI**: Modern UI built with TailwindCSS and Radix UI components

## Tech Stack

- **Frontend**: React 19, Next.js 15
- **Backend**: Node.js with Next.js API routes and custom server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time Communication**: Socket.io
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Form Validation**: Zod

## Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/ja-moveo"
NEXTAUTH_SECRET="your-secret-here"
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Build for Production

```bash
npm run build
npm run start
```

## Project Structure

- `/app`: Next.js application pages and components
- `/components`: Reusable UI components
- `/prisma`: Database schema and migrations
- `/actions`: Server actions
- `/lib`: Utility functions and helpers
- `/public`: Static assets

## License

[MIT](https://choosealicense.com/licenses/mit/)
