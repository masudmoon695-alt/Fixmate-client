# FixMate Client (Frontend)

**FixMate** — a smart device & home appliance repair booking platform. Customers book vetted technicians for smartphone, laptop, AC, refrigerator, TV, washing machine and electrical repair, and pay only after the job is completed.

- **Framework:** Next.js 15 (App Router, JavaScript)
- **Auth:** BetterAuth (MongoDB adapter) + short-lived Express JWT via `app/api/token`
- **Styling:** Tailwind CSS + shadcn-style UI components
- **Toasts:** sonner
- **Charts:** recharts
- **Icons:** lucide-react
- **Image upload:** ImgBB (via `components/shared/image-upload`)
- **Payments:** Stripe Checkout (server creates session; client only redirects + verifies)

## Live URL

- Frontend (placeholder until deployed): `https://your-fixmate-domain.com` (set `NEXT_PUBLIC_URL` / `NEXT_PUBLIC_API_URL` accordingly)

## Test accounts (seed / placeholder)

Credentials should be filled from the seeded data in the backend `server` folder.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.com` | `Fixmate@1234` |
| Technician | `technician@fixmate.com` | `Fixmate@1234` |
| Customer | `customer@fixmate.com` | `Fixmate@1234` |

## Key features

- Public pages: Home, Services (+ filters & pagination server-side), Service Details, About
- Auth: Sign Up / Sign In with validated forms (customer or technician role only), role-based redirect
- Customer: dashboard with stats + charts, booking management (cancel, pay after completion), payment history
- Technician: add/edit/delete services, availability toggle, incoming repair requests workflow (accept / reject / start / complete)
- Admin: user & service management, booking oversight, transactions & revenue
- Profile: edit name, phone, area, bio, photo (ImgBB)
- Payments: Stripe Checkout redirect + success/cancel pages with session verification
- Global: skeletons, error/not-found boundaries, empty states, confirm modals, sonner toasts

## Setup

```bash
cp .env.example .env.local
# fill in .env.local (see below)
npm install
npm run dev
```

### Environment variables (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_URL=http://localhost:3000

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

JWT_SECRET=<same as backend server JWT_SECRET>

MONGODB_URI=<same database the backend uses>
DB_NAME=<same database name>

TRUSTED_ORIGINS=http://localhost:3000
```

- Never commit `.env.local` (already git-ignored).
- Backend runs at `http://localhost:5000`; frontend at `http://localhost:3000`.

## Key routes

| Route | Access |
|---|---|
| `/`, `/services`, `/services/[id]`, `/about` | Public |
| `/sign-in`, `/sign-up` | Public |
| `/payment/success`, `/payment/cancel` | Customer |
| `/dashboard/customer`, `/dashboard/customer/bookings`, `/dashboard/customer/payments` | Customer |
| `/dashboard/technician`, `/dashboard/technician/add-service`, `/dashboard/technician/my-services`, `/dashboard/technician/requests` | Technician |
| `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/services`, `/dashboard/admin/bookings`, `/dashboard/admin/transactions` | Admin |
| `/dashboard/profile` | All logged-in users |

## Notes

- Auth token for the Express API is fetched through BetterAuth session → `app/api/token` → JWT, attached via `lib/api.js`.
- Payment flow: Stripe Checkout session created by the Express server; client only redirects + verifies via `GET /api/payments/verify`.
- Server-side filters/sorting/pagination for services happen through URL search params (`?search=&category=&serviceMode=&sort=&page=`).

## Packages used

- `next`, `react`, `react-dom`
- `@better-auth/mongo-adapter`, `better-auth`, `mongodb`
- `jsonwebtoken`
- `tailwindcss`, `autoprefixer`, `postcss`
- `recharts`
- `sonner`
- `lucide-react`
- ImgBB (external image host)
