# Event Booking

A full-featured web application for browsing events, registering users, and managing bookings. The project combines an Angular frontend, an Express API, MongoDB persistence, and Netlify serverless deployment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Seeding Sample Events](#seeding-sample-events)
- [Build and Deployment](#build-and-deployment)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Features

- Public event catalog with categories, event details, pricing, and available seats.
- User registration and login with JWT authentication.
- User profile and personal bookings page.
- Booking creation and cancellation.
- Admin dashboard for managing events, users, and bookings.
- Role-based access for `user` and `admin` accounts.
- MongoDB persistence through Mongoose models.
- Netlify Functions integration for serverless API deployment.

## Tech Stack

### Frontend

- Angular 21
- Angular Router
- Angular Forms
- Angular Material / CDK
- RxJS
- SCSS

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Deployment

- Netlify
- Netlify Functions
- serverless-http

## Architecture

The application is split into two main layers:

- `src/` contains the Angular client.
- `server/` contains the Express API, models, middleware, and routes.

In development, the Angular client uses:

```ts
http://localhost:5000/api
```

In production, the frontend uses a relative API path:

```ts
/api
```

For Netlify deployments, requests to `/api/*` are redirected to:

```txt
/.netlify/functions/api/:splat
```

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB Atlas or a local MongoDB instance
- Angular CLI, if you want to use `ng` globally

Check installed versions:

```bash
node --version
npm --version
```

## Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the `server/` directory:

```env
MONGO_URI=mongodb+srv://user:password@cluster.example.mongodb.net/event-booking
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
CLIENT_URL=http://localhost:4200
```

Optional variables:

```env
MONGO_DNS_SERVERS=8.8.8.8,1.1.1.1
URL=https://your-netlify-site.netlify.app
DEPLOY_PRIME_URL=https://deploy-preview-url.netlify.app
```

Description:

- `MONGO_URI` - MongoDB connection string.
- `JWT_SECRET` - secret key used to sign JWT tokens.
- `PORT` - Express API port for local development.
- `CLIENT_URL` - allowed CORS origin for development.
- `MONGO_DNS_SERVERS` - DNS override for `mongodb+srv://` connections if the runtime has DNS resolution issues.
- `URL` and `DEPLOY_PRIME_URL` - Netlify URLs used for CORS in production and deploy previews.

## Running Locally

Start the backend API:

```bash
cd server
npm run dev
```

The API will be available at:

```txt
http://localhost:5000/api
```

In a separate terminal, start the Angular application:

```bash
npm start
```

The frontend will be available at:

```txt
http://localhost:4200
```

Check the API health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Seeding Sample Events

The project includes a seed script with sample events. Before running it, make sure `server/.env` contains a valid `MONGO_URI`.

```bash
cd server
npm run seed:events
```

The seed script performs upserts by event title, so it can be run multiple times without duplicating existing records.

## Build and Deployment

Create a production build:

```bash
npm run build
```

The build output is generated in:

```txt
dist/event-booking/browser
```

Netlify configuration is defined in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist/event-booking/browser"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

For Netlify deployment, set at least these environment variables in the Netlify dashboard:

```env
MONGO_URI=...
JWT_SECRET=...
URL=https://your-netlify-site.netlify.app
```

## API Endpoints

Base path for the local backend:

```txt
http://localhost:5000/api
```

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Checks whether the API is running |

### Auth

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Registers a new user |
| POST | `/auth/login` | Public | Logs in and returns a JWT |
| GET | `/auth/me` | Authenticated | Returns the current user |

Example login request:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Protected endpoints expect this header:

```txt
Authorization: Bearer <token>
```

### Events

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/events` | Public | Returns all events |
| GET | `/events/:id` | Public | Returns a single event |
| POST | `/events` | Admin | Creates an event |
| PUT | `/events/:id` | Admin | Updates an event |
| DELETE | `/events/:id` | Admin | Deletes an event |

Example event payload:

```json
{
  "title": "Angular Connect Sofia",
  "description": "Full-day conference for Angular developers.",
  "location": "Sofia, Bulgaria",
  "date": "2026-06-12T00:00:00.000Z",
  "price": 89,
  "availableSeats": 350,
  "imageUrl": "https://example.com/event.jpg",
  "category": "Technology"
}
```

### Bookings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/bookings` | Authenticated | Creates a booking |
| GET | `/bookings/my` | Authenticated | Returns the current user's bookings |
| GET | `/bookings` | Admin | Returns all bookings |
| PATCH | `/bookings/:id/cancel` | Owner/Admin | Cancels a booking |

Example booking request:

```json
{
  "eventId": "665f1f0f0000000000000000"
}
```

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/users` | Admin | Returns all users |

## Project Structure

```txt
event-booking/
├── netlify/
│   └── functions/
│       └── api.ts
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   └── shared/
│   ├── environments/
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── netlify.toml
├── package.json
└── README.md
```

## Useful Commands

| Command | Description |
| --- | --- |
| `npm start` | Starts the Angular development server |
| `npm run build` | Creates a production build |
| `npm test` | Runs the Angular tests |
| `cd server && npm run dev` | Starts the Express API in development mode |
| `cd server && npm run build` | Compiles the backend TypeScript code |
| `cd server && npm start` | Starts the compiled backend |
| `cd server && npm run seed:events` | Adds sample events to the database |

## Security Notes

- Do not commit `.env` files or real secret values.
- Use a long, random `JWT_SECRET` in production.
- Restrict CORS origins to the actual frontend domains.
- Use strong passwords for admin accounts and assign the `admin` role only to trusted users.
