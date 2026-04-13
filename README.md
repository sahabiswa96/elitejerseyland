# Elite Jersey Land

Elite Jersey Land is a modern Next.js-based web application for managing and showcasing premium sports jerseys with fast performance and scalable architecture.

## Tech Stack

- Next.js (App Router)
- PostgreSQL Database
- Tailwind CSS
- JWT Authentication
- Nodemailer (Contact Email Support)

## Environment Variables

Create a `.env` file in the project root:

DATABASE_URL="postgresql://postgres:12345@localhost:5433/elite_jersey_land"
JWT_SECRET="elite_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

CONTACT_TO_EMAIL="elitejerseyland@gmail.com"
SMTP_FROM_EMAIL="elitejerseyland@gmail.com"
SMTP_USER="elitejerseyland@gmail.com"
SMTP_PASS="your_app_password_here"

## Getting Started

Install dependencies:

npm install

Run development server:

npm run dev

Open:

http://localhost:3000

## Database Setup

Make sure PostgreSQL is running on:

localhost:5433

Database name:

elite_jersey_land

## Deployment

Recommended deployment platform:

Vercel

Steps:

1. Push code to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy

## Author

Developed by Biswajit Saha