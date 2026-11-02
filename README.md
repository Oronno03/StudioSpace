# StudioSpace

**Peer-to-peer creative workspace & production studio sharing platform** — book photo studios, cinema sound stages, podcast lounges, music suites and art workshops by the hour.

🔗 **Live site:** _add your Vercel deployment URL here after deploying (e.g. https://studiospace-live.vercel.app)_
🎬 **API repo:** `../studiospace-backend` (Express + MongoDB)

---

## ✨ What StudioSpace does

- **Discover & filter studios** — explore a live marketplace with category chips, keyword search, price range, location and rating/price sorting. Category cards on the home page deep-link straight into a pre-filtered `/studios` view.
- **Rich studio pages** — every listing has a photo gallery with prev/next navigation, amenity checklist, capacity, deposit, host card, star rating and real guest reviews.
- **Transparent hourly booking** — pick a date + start/end time in a custom booking dialog; the total (hours × rate + refundable deposit) updates live. Bookings start as **Pending** and hosts confirm them from the dashboard.
- **Host tools** — list a studio with a direct image URL, manage listings with update/delete + confirmation modals, and confirm / decline / complete incoming bookings.
- **My Bookings** — status-filtered reservation list (Pending, Confirmed, Completed, Cancelled), one-tap cancellation for pending slots, and a downloadable **PDF invoice** for confirmed/completed bookings.
- **Saved studios wishlist** — heart any studio card; your shortlist is stored in MongoDB and shown on `/wishlist`.
- **Authentication** — email/password with live password rules, Google Identity Services sign-in, and JWT sessions sealed in **HTTPOnly cookies**.
- **Polished UX** — full light/dark theme toggle, Sonner toast notifications for every action, branded skeleton loaders and a custom 404 page.

## 🧱 Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | **Next.js 16** (App Router, Turbopack), React 19, TypeScript |
| Styling | **Tailwind CSS v4** design tokens, custom light/dark theme system |
| UI extras | Swiper (hero slider), Sonner (toasts), jsPDF + autotable (invoices) |
| Backend | **Express 5**, Node.js |
| Database | **MongoDB** with Mongoose |
| Auth | JWT in HTTPOnly cookies, bcryptjs hashing, Google Identity Services |
| Deployment | Vercel (client) · Render (server) |

## 🚀 Local setup

### 1. Backend

```bash
cd ../studiospace-backend
npm install
cp .env.example .env        # set MONGODB_URI + JWT_SECRET (+ GOOGLE_CLIENT_ID)
npm run seed                # demo studios, test accounts, a sample booking
npm run dev                 # http://localhost:5000
```

### 2. Frontend

```bash
npm install
cp .env.example .env        # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                 # http://localhost:3000
```

### Environment variables

| File | Variable | Purpose |
|------|----------|---------|
| `studiospace-backend/.env` | `MONGODB_URI` | MongoDB connection string |
| | `JWT_SECRET` | Secret used to sign session tokens |
| | `CLIENT_ORIGIN` | Allowed frontend origin (CORS) |
| | `GOOGLE_CLIENT_ID` | Google OAuth web client ID (token verification) |
| `studiospace/.env` | `NEXT_PUBLIC_API_URL` | Express API base URL |
| | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth web client ID (button) |

> Studio cover photos are supplied as direct image URLs — no third-party upload keys are required.

## 🔑 Examiner test credentials

| Role | Email | Password |
|------|-------|----------|
| Guest | `harry@studiospace.dev` | `Password123` |
| Host | `maya@studiospace.dev` | `Password123` |

The host account owns all seeded studios, so it can confirm bookings and test the dashboard; the guest account can book, cancel and download invoices.

## 🔐 Challenge implementations

1. **JWT in HTTPOnly cookies** — the API sets `studiospace_token` as `httpOnly`, `sameSite=lax`; every mutation (`POST /api/studios`, `PATCH`/`DELETE /api/studios/:id`, `POST /api/bookings`, wishlist) is guarded and returns **401** without a valid cookie.
2. **Double-booking prevention** — `POST /api/bookings` queries MongoDB for overlapping **Confirmed** bookings on the same studio and date, rejecting collisions with a clear `409` message.
3. **Theme customization** — navbar sun/moon toggle switches the entire UI between light and dark; the choice persists in `localStorage` and is applied before hydration to avoid flashes.

## ⭐ Optional features

- **PDF booking invoices** — generated client-side with jsPDF from My Bookings.
- **Saved studios wishlist** — heart toggles persist in MongoDB (`User.wishlist`).

## 🧪 Testing

The API ships with an end-to-end test suite:

```bash
cd ../studiospace-backend
node tests/api.test.mjs     # 34 assertions: auth, CRUD, bookings, wishlist
```

The frontend was verified in a headless browser (login, protected-route reloads, booking, cancellation, CRUD, wishlist, theme toggle, 404) with zero JavaScript errors.

## 📁 Project structure

```
app/
  page.tsx                 # Home — slider, featured studios, categories, guarantees
  studios/                 # Explore + [id] details + edit/[id]
  add-studio/              # New listing (private)
  my-listings/             # Host listing management (private)
  my-bookings/             # Guest bookings + PDF invoice (private)
  dashboard/               # Host booking management + stats (private)
  wishlist/                # Saved studios (private)
  login/ register/         # Auth
  how-it-works/ about/     # Static content
  not-found.tsx loading.tsx
components/                # Navbar, Footer, cards, modals, skeletons, forms
lib/                       # API client, auth/theme contexts, types, format, invoice
```
