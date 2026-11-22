You are building the COMPLETE CLIENT (frontend) of "FixMate", a Smart Device & Home Appliance Repair Service Booking Platform (Assignment 9, Category 006). Build everything described below. Do not stop until every item in the final checklist is done.

====================================================
ABSOLUTE RULES (read first)
====================================================
1. The backend is ALREADY COMPLETE and running at http://localhost:5000 (example: http://localhost:5000/api/services). It lives in the sibling `server` folder of this workspace. You may READ it, but you must NEVER edit, create, delete or reformat any file inside the server folder. All your work happens only inside the client folder.
2. BEFORE writing any code, read the server code (routes, controllers, middlewares, especially verifyToken, role middlewares, the booking status logic, the payment/Stripe controllers, response shapes, query params, and the CORS config). Then write the exact API contract you found in lib/api-contract.md notes inside your reasoning and follow it exactly. Do not guess endpoints, field names, query params, or response shapes.
3. If something the frontend needs is missing or different on the server, do NOT change the server and do NOT fake data. Build the UI as far as possible, and list the gap in your final report.
4. Never hardcode secrets or URLs. Client config goes in .env.local (also create .env.example with empty values). .env.local must be git-ignored.
5. Never trust role, price or amount from the client. Payment sends only bookingId.
6. Commit after every meaningful step with a descriptive conventional message (feat:, fix:, chore:, refactor:). Minimum 20 meaningful commits. Never commit secrets.

====================================================
TECH STACK
====================================================
- Next.js App Router, JavaScript (or TypeScript only if the project is already TS; never mix)
- Tailwind CSS + shadcn/ui (one UI library only)
- BetterAuth with MongoDB adapter (runs inside Next.js)
- sonner (toasts), recharts (charts), lucide-react (icons), next/font, next/image
- ImgBB API for ALL image uploads (file input, never a URL text field)
- Stripe Checkout (the server creates the session; the client only redirects)

.env.local keys:
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=        (same database the server uses; check the server .env for DB_NAME, do not print or copy server secrets into any committed file)
DB_NAME=
JWT_SECRET=         (MUST equal the server's JWT_SECRET)

====================================================
AUTHENTICATION ARCHITECTURE
====================================================
- BetterAuth + MongoDB adapter, stored in the existing `user` collection. Add additionalFields: role (default 'customer', input:false), phone, area, bio. BetterAuth's session/account/verification collections are auto-created; do not touch them manually.
- Sign-up role is only 'customer' or 'technician'. Add a server-side hook in BetterAuth so anything else (including 'admin') is saved as 'customer'. Admin cannot be selected or created from the UI.
- Add the production domain to BetterAuth trustedOrigins via env (support a comma-separated list).
- The Express server verifies a JWT. Read the server's verifyToken middleware and match its exact expectations (header format, payload fields, secret, algorithm, expiry). Create a Next.js route handler app/api/token/route.js that reads the BetterAuth session and signs a short-lived JWT accordingly.
- Create ONE reusable helper lib/api.js that fetches/caches the token and calls the server with Authorization: Bearer <token>. No page calls fetch with raw URLs or raw tokens. Handle 401 (sign out / go to sign-in), 403 (forbidden message), 409 (show server message), and show server `message` in error toasts.
- Optional: Google social login (Google users get 'customer').
- Role is always read from the session/DB, never from the URL, localStorage or query string.

====================================================
ROUTES AND ACCESS
====================================================
Public: / , /services , /services/[id] , /about
Auth pages: /sign-up , /sign-in (logged-in users are redirected to their own dashboard)
Customer only: /payment/success , /payment/cancel , /dashboard/customer , /dashboard/customer/bookings , /dashboard/customer/payments
Technician only: /dashboard/technician , /dashboard/technician/add-service , /dashboard/technician/my-services , /dashboard/technician/requests
Admin only: /dashboard/admin , /dashboard/admin/users , /dashboard/admin/services , /dashboard/admin/bookings , /dashboard/admin/transactions
All logged-in users: /dashboard/profile
Any unknown route: custom not-found page

Protection (use middleware/proxy appropriate for the installed Next.js version, plus a client-side guard component):
- Logged-out on any private route -> /sign-in?redirect=<original path>
- Wrong-role user (customer opening /dashboard/admin, etc.) -> redirect to own dashboard (and show a "Forbidden" toast/message)
- CRITICAL: reloading ANY route (public or private) must not throw errors, and a logged-in user must NEVER be redirected to login on reloading a private route. Never redirect while the session is still loading; show a skeleton until the session resolves.
- /dashboard (bare) redirects to the correct role dashboard.

====================================================
DESIGN SYSTEM (original, recruiter-friendly)
====================================================
- Do NOT copy any website or any previous module/assignment project. Original look only. Suggested palette: deep teal primary, warm amber accent, soft neutral background, strong text contrast. Define colors as CSS variables / Tailwind tokens.
- ONE heading font and ONE body font via next/font, used everywhere. Same main-heading style (font, size, color) across all sections. Balanced paragraph spacing, readable text.
- Same button style everywhere as the home page (primary, secondary, outline, destructive variants defined once).
- Equal-height, equal-width cards; uniform image sizes (fixed aspect ratio + object-cover); grid layouts; consistent spacing and alignment.
- Fully responsive on mobile, tablet, desktop.
- Reusable components: Logo, StatsCard, StatusBadge, PaymentBadge, EmptyState, ConfirmModal, ServiceCard, ImageUpload, DataTable/responsive list (table on desktop, cards on mobile), PageHeader, Skeletons.
- Status badge colors (identical across ALL dashboards, defined in one constants file): requested=blue, accepted=indigo, in-progress=amber, completed=green, rejected=red, cancelled=gray. Payment: unpaid=orange, paid=green.
- Constants file holds categories (Smartphone, Laptop & PC, AC, Refrigerator, TV, Washing Machine, Electrical), service modes (Home Visit, Shop Drop-off), statuses, and colors. No repeated string literals.

====================================================
PUBLIC LAYOUT
====================================================
Navbar:
- FixMate logo with a wrench/tool icon, same style and size on every page (identical to home)
- Items: Home (/), Services (/services), How It Works / About (/about); active route highlighted; sticky
- Logged-out: Sign In and Sign Up buttons
- Logged-in: avatar; clicking opens a dropdown with name, role badge (Customer / Technician / Admin), Dashboard link (to the correct role dashboard), Update Profile, Sign Out (with toast)
- Mobile: collapses into a hamburger menu
Footer:
- FixMate logo, short tagline, quick links (Home, Services, About), popular categories (link to /services?category=...), contact info (email, phone, address), copyright, social links using the NEW X logo (custom X SVG, NOT the Twitter bird) plus other socials.

====================================================
SIGN UP (/sign-up) and SIGN IN (/sign-in)
====================================================
Sign Up: title, form with Full Name, Email, Password, Role selection (Customer / Technician as radio cards; NO admin). Validation with errors shown under each field, and the form must not submit when invalid: required fields, valid email, password at least 6 chars, at least one uppercase, at least one lowercase. Success toast + redirect to role dashboard; failure (e.g. email exists) error toast. Link to Sign In.
Sign In: email + password with validation, error toast for wrong credentials, then redirect to the originally requested page (?redirect=) or to the user's own dashboard. Link to Sign Up. Optional Google button.

====================================================
HOME PAGE (/)
====================================================
1. Hero/banner: headline "Broken Device? Get It Fixed by Verified Technicians", subtitle, a search box and/or CTA that leads to /services (search box submits to /services?search=...), and a high-quality illustration or photo. (Slider optional.)
2. Featured Services: fetch the 6 latest approved+available services from the server (use the server's limit param / latest sorting as found in the server code). Equal-size cards showing: image, title, category, service mode, starting price, technician name, View Details button.
3. How FixMate Works: 4-step visual flow: Find a Service -> Send a Request -> Technician Fixes It -> Pay After Completion.
4. Popular Categories + Why Choose Us: all 7 categories as clickable cards linking to /services?category=<Category> (must open the services page already filtered), plus trust points/stats (verified technicians, jobs completed, pay after service) and/or testimonials. Static data is fine here but it must look professional and match the theme.
Add skeleton loading and an empty state for the featured section.

====================================================
BROWSE SERVICES (/services) — Challenge 1 (client part)
====================================================
- Responsive grid: 4 or 3 cards per row desktop, 2 tablet, 1 mobile. Card: image, title, category, service mode, service area, starting price, technician name, View Details button.
- Search bar (title or category), category filter, service mode filter, sort dropdown (Price: Low to High, Price: High to Low, Newest).
- ALL search/filter/sort happens on the SERVER via query params exactly as the server defines. NEVER use JavaScript .filter()/.sort() on the client for this.
- The URL search params are the single source of truth (?search=&category=&serviceMode=&sort=&page=). Filters survive reload; /services?category=AC opens already filtered. Debounce the search input (~400ms). Include a Clear Filters button.
- Pagination (Previous / Next / page numbers) if the server supports page/limit and returns totals; it must work together with search/filter/sort.
- Friendly empty state with CTA when nothing matches. Skeleton while loading.

====================================================
SERVICE DETAILS (/services/[id]) and REPAIR REQUEST
====================================================
- Show large image, title, category, description, starting price, estimated duration, service mode, service area, and a technician summary (name, photo, area, bio; use whatever the server returns, and degrade gracefully if photo/bio is missing).
- If the service does not exist or is not approved/available (server 404) -> call notFound() to show the Not Found page.
- "Request Repair" button:
  - Logged-out: redirect to /sign-in?redirect=/services/[id] (return here after login)
  - Technician or Admin: disabled/hidden with the notice "Only customers can request a repair"
  - Customer: opens a request form (modal or section)
- Form fields: Name (read-only, from session), Email (read-only, from session), Phone, Address, Preferred Date (today or future only), Problem Description (minimum 20 characters). Validation errors under fields.
- Submit to the bookings API. On 409/duplicate -> error toast "You already have an active request for this service". On success -> success toast with a link to My Bookings (/dashboard/customer/bookings).

====================================================
DASHBOARD LAYOUT
====================================================
One responsive Dashboard Layout (separate from the public layout, NO public footer): collapsible sidebar (toggle button on mobile/tablet), top bar with the user's avatar, name and role badge, and a link back to Home. Sidebar menu changes dynamically by role. Full-width content area, consistent theme. Every overview page uses the reusable StatsCard and includes at least one chart (recharts) for quick data visualization. Skeletons for every dashboard route (loading.js).

CUSTOMER
- /dashboard/customer: stats cards Total Requests, Active Jobs, Completed Jobs + a chart (e.g. bookings by status).
- /dashboard/customer/bookings: table (cards on mobile) with service image & title, technician name, preferred date, base price / final amount, status badge, payment badge. Cancel button ONLY when status === 'requested' (confirmation modal, then cancel via API). Pay Now button ONLY when status === 'completed' && paymentStatus === 'unpaid': call the create-checkout-session API with ONLY the bookingId, then redirect to the returned Stripe URL. A paid booking shows a Paid badge instead of the button. Empty state with CTA to browse services.
- /dashboard/customer/payments: table with service title, technician name, amount, transaction ID, payment date. Empty state.

TECHNICIAN
- /dashboard/technician: stats cards Total Services, Approved Services, Pending Requests + a chart.
- /dashboard/technician/add-service: validated form: Title, Category (dropdown), Description, Base Price (positive number), Estimated Duration, Service Mode (Home Visit / Shop Drop-off), Service Area, Service Image uploaded to ImgBB (file input with preview, validation of type/size, upload loading state). Technician name and email are read-only from the session. Submit creates the service (server sets pending/available). Toast: the service is waiting for admin approval.
- /dashboard/technician/my-services: full CRUD table: image, title, category, price, approval status badge (Pending/Approved/Rejected), availability. Edit in a pre-filled modal or page (toast explains it returns to pending approval), Delete with confirmation modal, availability toggle switch. Empty state with CTA to add a service.
- /dashboard/technician/requests: table of this technician's bookings: customer name, phone, address, preferred date, problem description, service title, status. Show ONLY valid actions: requested -> Accept / Reject (reject needs confirmation modal); accepted -> Start Work; in-progress -> Mark Completed (small modal asking the final amount, pre-filled with the base price, must be a number greater than 0); completed -> no action, show payment badge; rejected/cancelled -> no action. Status filter: All / Requested / Accepted / In Progress / Completed. Toast on every update; show server error messages.

ADMIN
- /dashboard/admin: stats cards Total Users, Total Technicians, Pending Services + charts (e.g. bookings by status, revenue, services by category) using whatever the server provides.
- /dashboard/admin/users: table with photo, name, email, role, joined date. Role dropdown (customer/technician/admin) with confirmation; the admin's OWN row is disabled.
- /dashboard/admin/services: table of all services with an approval-status filter; pending shown first or filtered by default; Approve and Reject buttons (reject with confirmation).
- /dashboard/admin/bookings: read-only table: service, customer, technician, date, status, payment status, amount; status filter.
- /dashboard/admin/transactions: table of every payment: customer, technician, service, amount, transaction ID, payment date; TOTAL REVENUE shown above the table.

PROFILE (/dashboard/profile, all roles)
- Edit Name, Phone, Area, Bio, and Profile Photo (ImgBB file upload with preview). Email and role are read-only.
- After saving, the new name and photo must appear in the navbar and dashboard top bar immediately WITHOUT logging out (refresh/update the BetterAuth session and local UI state).

====================================================
STRIPE PAYMENT PAGES
====================================================
- /payment/success?session_id=...: call the verify API with the session id, show a success message with the amount and transaction ID and a button back to My Bookings. Guard against double calls (React Strict Mode / refresh) with a ref; treat an "already recorded" response as success. Friendly states for loading, missing session_id, and failure.
- /payment/cancel: friendly "Payment cancelled" message with a Try Again button back to My Bookings. Nothing else happens.
- Test card for manual testing: 4242 4242 4242 4242, any future date, any CVC. Test mode only.

====================================================
GLOBAL REQUIREMENTS
====================================================
- Loading: skeleton/spinner loading.js for public pages and for every dashboard route.
- Error pages: custom not-found.js with a repair/tools-themed illustration (inline SVG) and a Back to Home button; custom error.js error boundary with a clear message and a retry button.
- Toasts (sonner) for sign up, sign in, sign out, every CRUD action, status updates, payments, and errors.
- Empty states with a CTA for: no services, no bookings, no requests, no search results, no payments.
- Confirmation modals before: deleting a service, cancelling a booking, rejecting a request (also confirm role changes and rejecting a service).
- Disable submit buttons while loading to prevent double submission.
- next/image configured with remotePatterns for ImgBB (i.ibb.co) and any other image host the seed data uses (check the server data).
- Remove all debug console.log before finishing.

====================================================
OPTIONAL EXTRAS (do these AFTER everything above works; they add polish)
====================================================
- Dark/light theme toggle with smooth transition on public pages and the dashboard (persist preference; avoid hydration flicker).
- Job timeline tracker (Requested -> Accepted -> In Progress -> Completed -> Paid) in My Bookings, using statusHistory if the server provides it, otherwise derive it from the current status.
- PDF invoice download for paid bookings (generate client-side from booking/payment data).
- Pagination on /services if not already done.
- Rating & review and Pro technician plan ONLY if the server already supports them; otherwise skip and mention it in the final report.

====================================================
README.md (client)
====================================================
Project name, purpose, live URL (placeholder until deployed), admin credentials (placeholder, fill from the seeded admin), test technician and customer credentials, key features, tech stack, setup instructions (env vars from .env.example), and the list of npm packages used.

====================================================
DEPLOYMENT READINESS
====================================================
- No errors on landing; no errors on reloading from any route; logged-in users never bounced to login on reload.
- trustedOrigins and API URL come from env so the production domain can be added.
- No hardcoded localhost URLs in code.

====================================================
HOW TO WORK
====================================================
Order: read server code -> project setup & theme -> BetterAuth + token route + api helper -> route protection -> navbar/footer + public layout -> sign-up/sign-in -> home page -> services page with server-side filters -> service details + request form -> dashboard layout + shared components -> customer pages -> payment pages -> technician pages -> admin pages -> profile -> loading/error/not-found -> responsive and design polish -> optional extras -> README.
Run the app and fix build/lint errors as you go. Test every flow with all three roles against the real server at http://localhost:5000.

FINAL STEP: print a requirement checklist (every page, every rule above) marked Done / Partial / Missing, list any server gaps you found (without changing the server), and tell me exactly which manual tests I should run.