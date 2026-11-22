<div align="center">

# 🔧 FixMate

**On-demand smart device & home appliance repair booking platform**

Book trusted, verified technicians for your smartphone, laptop, AC, refrigerator, TV, washing machine or electrical fix, and pay only after the job is completed.

[Live Demo](https://your-frontend.vercel.app) · [Backend Repo](https://github.com/masudmoon695-alt/YOUR-BACKEND-REPO) · [Report Bug](https://github.com/masudmoon695-alt/Fixmate-client/issues)

</div>

---

## 📸 Screenshots

| Home (Dark) | Services | Dashboard |
|---|---|---|
| ![Home](./screenshots/home.png) | ![Services](./screenshots/services.png) | ![Dashboard](./screenshots/dashboard.png) |

## ✨ Features

### 👤 Customer
- Browse and search services by category (Smartphone, Laptop & PC, AC, Refrigerator, TV, Electrical, etc.)
- View service details with technician info, price, duration and service area
- Book a service with preferred date and address
- Track booking status (Requested → Accepted → Completed)
- Online payment, with a payment history page
- ⭐ **Rate & Review** a technician (1–5 stars + short review) after a paid booking
- 📄 **Download PDF invoice** for paid bookings
- Cancel pending bookings
- Profile settings with photo upload

### 🛠️ Technician
- Add new services (sent for admin approval)
- Manage own services and incoming requests
- Accept, update and complete bookings
- Profile with service area and skills

### 🛡️ Admin
- Review and approve or reject technician services
- Manage users and services
- Monitor transactions

### 🎨 General
- 🌗 Smooth **dark / light theme** toggle (public pages and dashboards)
- Role-based protected dashboards (customer, technician, admin)
- Fully responsive (mobile, tablet, desktop)
- Skeleton loaders, toast notifications, graceful error handling
- Image upload via ImgBB (through a secure server-side API route)

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | JavaScript / TypeScript |
| Styling | Tailwind CSS, CSS variables (theme tokens) |
| Auth | Better Auth |
| Theme | next-themes |
| Icons | lucide-react |
| Image hosting | ImgBB |
| Deployment | Vercel |

> Update this table if your project uses different libraries (for example, a different auth library or UI kit).

## 📁 Project Structure

```
Frontend/
├── app/
│   ├── api/
│   │   ├── auth/              # Auth endpoints
│   │   └── upload-image/      # Server-side ImgBB upload
│   ├── dashboard/
│   │   ├── customer/          # Bookings, payments
│   │   ├── technician/        # Add service, my services, requests
│   │   ├── admin/             # Manage users, services, transactions
│   │   └── profile/           # Profile settings (all roles)
│   ├── services/              # Service list and details
│   └── page.js                # Home page
├── components/                # Reusable UI components
├── lib/                       # API helpers and utilities
├── public/                    # Static assets
├── middleware.js              # Route protection
├── agents.md                  # AI agent rules for this project
└── next.config.mjs
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm, yarn or pnpm
- A running instance of the FixMate backend (see the backend repo)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/masudmoon695-alt/Fixmate-client.git
cd Fixmate-client

# 2. Install dependencies
npm install

# 3. Create the environment file
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_long_random_secret

# Image upload (server-side only, no NEXT_PUBLIC_ prefix)
IMGBB_API_KEY=your_imgbb_api_key
```

> ⚠️ Never commit `.env.local`. Keep secret keys out of any `NEXT_PUBLIC_` variable.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## 🔐 Roles & Access

| Role | Access |
|---|---|
| Customer | Browse and book services, pay, review, download invoices |
| Technician | Add services, manage requests |
| Admin | Approve services, manage users and transactions |

Visiting a dashboard that belongs to another role redirects the user to their own dashboard with a "Forbidden" message. Reloading any route never redirects a logged-in user to login while the session is still loading.

## ☁️ Deployment (Vercel)

1. Push the repository to GitHub
2. Import it in [Vercel](https://vercel.com) (Framework: Next.js)
3. Add the environment variables listed above, with `NEXT_PUBLIC_API_URL` set to your deployed backend URL
4. Deploy, then update the backend's `CLIENT_URL` with the frontend URL so CORS works

## 🗺️ Roadmap
- [ ] Real-time booking notifications
- [ ] Technician availability calendar
- [ ] In-app chat between customer and technician
- [ ] Multi-language support (Bangla / English)

## 🤝 Contributing

Contributions are welcome.

1. Fork the project
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

## 👨‍💻 Author

**Masud**
- GitHub: [@masudmoon695-alt](https://github.com/masudmoon695-alt)

---

<div align="center">
Made with ❤️ in Bangladesh
</div>
