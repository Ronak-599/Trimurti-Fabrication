# Trimurti Fabrication — MERN Stack

A full-stack fabrication workshop app with a React (Vite) frontend and an Express + MongoDB backend. Features include multilingual UI (English/Hindi/Marathi), public gallery, admin image uploads/deletes, reviews, and contact form email notifications.

## Project Structure

```
./
├─ Backend/                # Express API, MongoDB models, Cloudinary, Multer
│  ├─ Server.js            # App entry
│  ├─ config/              # DB, cloudinary, multer
│  ├─ controllers/         # Admin, gallery, reviews
│  ├─ routes/              # /api endpoints
│  ├─ utils/               # email, seed scripts
│  └─ uploads/             # local storage (dev); ignored by Git
├─ Client/                 # React + Vite frontend (TS)
│  ├─ pages/               # About, Services, Gallery, Contact, Admin
│  ├─ components/          # Header, Footer, Contact form
│  ├─ locales/             # en/hi/mr translations
│  └─ public/              # images and assets
├─ services/               # experimental integrations
├─ package.json            # root scripts (dev both)
└─ .gitignore              # excludes env files, uploads, and builds
```

## Requirements

- Node.js 18+ and npm
- MongoDB connection string (`MONGODB_URI`)
- Cloudinary account (Cloud name, API key, API secret)
- Email credentials for contact notifications (Gmail app password recommended)

## Setup

1) Install dependencies

```bash
# From project root
npm install

# Backend API
npm install --prefix Backend

# Frontend client
npm install --prefix Client
```

2) Configure environment

Create `Backend/.env` (use `Backend/.env.example` as reference):

```
MONGODB_URI=YOUR_MONGODB_URI
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=change_this_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

## Run (Development)

- Start backend only:

```bash
npm run dev --prefix Backend
```

- Start client only:

```bash
npm run dev --prefix Client
```

- Start both with concurrency:

```bash
npm run dev:all
```

By default, the client runs on Vite (e.g. http://localhost:5173) and proxies requests to the backend (`/api/...`). The backend listens on port `5000`.

## API Overview

- Gallery
  - `GET /api/gallery` — list images
  - `GET /api/gallery/service/:key` — list images for service key
  - `POST /api/gallery` — upload image (admin; bearer token)
  - `DELETE /api/gallery/:id` — delete image (admin)
- Reviews
  - `GET /api/reviews` — list reviews
  - `POST /api/reviews` — create review
  - `DELETE /api/reviews/:id` — delete review (admin)
- Admin
  - `POST /api/admin/login` — returns JWT token
- Contact
  - `POST /api/contact` — saves enquiry and sends email notification
- Health
  - `GET /api/health` — basic health check

## Admin Notes

- After successful login (`/api/admin/login`), the frontend stores the token in `localStorage` under `adminToken`.
- Admin features (upload/delete) are visible when `adminToken` exists.

## Gallery & Downloads

- Clicking an image in the Gallery triggers a download.
- The client first tries a CORS-safe blob download; if it fails, it rewrites Cloudinary URLs with `fl_attachment` to force download.

## Internationalization (i18n)

- Translations available in English (`en`), Hindi (`hi`), and Marathi (`mr`).
- Keys live under `Client/locales/`. The header, footer, services, gallery, and about pages all use i18n strings.

## Cloudinary & Multer

- In development, images may be served from local `Backend/uploads/` and/or Cloudinary.
- Cloudinary config is read from environment variables.

## CORS

- Allowed origins are configured in `Backend/Server.js`. In development, common localhost ports are allowed. Adjust for production.

## Deployment Tips

- Do not commit `.env` files or `uploads/` (already covered by `.gitignore`).
- Set environment variables on your hosting platform.
- Ensure Cloudinary credentials and MongoDB URI are present.

## Scripts

- Root `package.json` includes helpers:
  - `npm run dev:client` — start client
  - `npm run dev:backend` — start backend
  - `npm run dev:all` — start both (requires `concurrently`)

## Troubleshooting

- If client cannot reach API, check that the backend is running on port `5000` and Vite proxy is configured (client uses relative `/api`).
- If image upload fails, verify Cloudinary env variables.
- For contact email errors, confirm Gmail app password and less-secure app requirements.

## License

Proprietary — all rights reserved by Trimurti Fabrication. Do not redistribute without permission.
