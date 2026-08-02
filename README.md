# FixItNow — Professional Home Repair & Maintenance Platform

FixItNow is a modern, full-stack home service repair booking platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Stripe Checkout Integration**. The application seamlessly connects end-customers with verified local technicians for AC cooling, plumbing, electrical, and appliance repair services with transparent pricing and real-time status tracking.

---

## 🚀 Live Links & Project Info

* **Backend API Base URL:** `https://fixitnow-backend-production-4c0e.up.railway.app`
* **Live Frontend Vercel URL:** `<ADD_VERCEL_LIVE_FRONTEND_URL>`
* **Demo Video Walkthrough:** `<ADD_DEMO_VIDEO_URL>`

---

## 🔑 Evaluator & Demo Credentials

> **Notice:** Default production admin and role testing credentials for evaluator verification:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `<ADD_ADMIN_EMAIL>` | `<ADD_ADMIN_PASSWORD>` |
| **Technician / Provider** | `<ADD_TECHNICIAN_EMAIL>` | `<ADD_TECHNICIAN_PASSWORD>` |
| **Customer** | `<ADD_CUSTOMER_EMAIL>` | `<ADD_CUSTOMER_PASSWORD>` |

---

## ✨ Core Features & Role-Based Workflows

The platform provides dedicated features and route-gated dashboards for three distinct user roles:

### 1. 👤 Customer Role
* **Service Discovery:** Search, filter by category/price, and view detailed service offerings with ratings, reviews, and technician bios.
* **Interactive Booking:** 2-step booking modal to select visit date, preferred time slot, and contact details.
* **Online Payment:** Instant redirection to Stripe Hosted Checkout with automated status updates.
* **Customer Dashboard (`/dashboard/customer`):** View active bookings, payment transaction history, write service reviews, and save favorite services.

### 2. 🛠️ Technician / Provider Role
* **Job Dispatch Board (`/dashboard/technician`):** View incoming job requests assigned by category and location.
* **Status Workflow:** Accept, update progress (`PENDING` → `IN_PROGRESS` → `COMPLETED`), or decline job bookings.
* **Service Offerings Management:** Full CRUD over custom services offered (`POST /services`, `PATCH /services/:id`, `DELETE /services/:id`).
* **Availability & Profile:** Set weekly schedule availability and manage bio/hourly rates.
* **Technician Onboarding (`/be-a-technician`):** Submit technician application forms with skill verification.

### 3. 🛡️ Admin Role
* **Platform Overview (`/dashboard/admin`):** High-level analytics tracking overall revenue, completed bookings, active users, and system performance.
* **Category Management:** Full CRUD operations on service categories (`POST`, `PATCH`, `DELETE` `/admin/categories`).
* **User Status Gating:** Toggle user accounts between `ACTIVE` and `BANNED` (`PATCH /admin/categories`).
* **Technician Application Review:** Review and approve or reject pending technician onboarding applications.
* **Transaction & Review Oversight:** Audit platform payments and remove flagged/inappropriate reviews.

---

## 🔐 Authentication & Security Architecture

* **Dual-Token System:** Short-lived `accessToken` + long-lived `refreshToken`.
* **HTTP-Only Cookies:** Tokens are set server-side with `httpOnly`, `sameSite: "strict"`, and `secure` attributes. Tokens are **never stored in `localStorage` or `sessionStorage`** to prevent XSS attacks.
* **Silent Token Rotation:** The custom client wrapper (`lib/api.ts`) catches HTTP 401 status codes, triggers `POST /auth/refresh` automatically, and replays the original request cleanly.
* **Edge Proxy Route Protection:** Next.js `proxy.ts` (formerly `middleware.ts`) intercepts `/dashboard/*`, `/checkout/*`, and `/bookings/*` at the edge to block unauthenticated requests and redirect logged-in users away from auth pages (`/login`, `/register`).
* **Server Guarding:** Server components use `requireUser()` and `requireRole(role)` to prevent unauthorized role escalation.

---

## 💳 Stripe Payment Flow

```
[ Customer Booking Form ] ──► POST /api/bookings ──► [ Booking Created (PENDING) ]
                                                            │
[ Proceed to Payment ] ◄────────────────────────────────────┘
          │
          ▼
POST /api/payments/checkout
          │
          ▼
[ Stripe Hosted Checkout URL ] ──► Customer Pays via Stripe
                                              │
              ┌───────────────────────────────┴───────────────────────────────┐
              ▼                                                               ▼
 [ Success Redirect: /payment/success ]                        [ Cancel Redirect: /payment/cancel ]
  - Queries GET /api/bookings/:id                               - Allows 1-click Stripe retry
  - Renders confirmed booking receipt                           - Preserves pending booking
```

---

## 🛠️ Tech Stack & Dependencies

* **Core Framework:** Next.js 16.2.12 (App Router with Turbopack) & React 19
* **Language:** TypeScript 5 (Strict mode enabled)
* **Styling:** Tailwind CSS v4, Lucide React icons, Framer Motion
* **Forms & Validation:** React Hook Form (`react-hook-form`), `@hookform/resolvers`, Zod (`zod`)
* **Feedback & UI:** Sonner toasts (`sonner`), Custom Glassmorphism Skeletons
* **HTTP Client:** Axios & Native `fetch` wrapper with automatic credential forwarding (`credentials: "include"`)

---

## 📂 Project Directory Structure

```text
FixItNow-Frontend/
├── app/
│   ├── (auth)/             # Auth route group (login, register layout)
│   ├── about/              # About page
│   ├── be-a-technician/    # Technician onboarding application page
│   ├── contact/            # Contact form page
│   ├── dashboard/          # Role-gated dashboard routes
│   │   ├── admin/          # Admin management overview & CRUD pages
│   │   ├── customer/       # Customer bookings & payment tracking
│   │   └── technician/     # Technician job requests & service manager
│   ├── how-it-works/       # Process walkthrough page
│   ├── payment/            # Stripe success & cancel redirect pages
│   ├── services/           # Service catalog & dynamic [id] details page
│   ├── error.tsx           # Global Client Error Boundary
│   ├── not-found.tsx       # Custom 404 Not Found Page
│   ├── layout.tsx          # Root Layout & Metadata
│   ├── page.tsx            # Landing Home Page
│   ├── robots.ts           # Dynamic SEO robots configuration
│   └── sitemap.ts          # Dynamic SEO sitemap generator
├── components/
│   ├── auth/               # Auth forms & AuthProvider context
│   ├── dashboard/          # Role-specific dashboard widgets & modals
│   ├── home/               # Landing sections (Hero, Process, Testimonials, Footer)
│   ├── seo/                # JSON-LD structured data generators
│   ├── services/           # Catalog grid, filters, detail modals
│   └── ui/                 # Reusable skeletons, buttons, toasts
├── lib/
│   ├── admin-api.ts        # Admin API endpoints
│   ├── api.ts              # Central API client & refresh logic
│   ├── auth.ts             # Server-side cookie session helpers
│   ├── bookings-payments-api.ts # Booking & Stripe Checkout API layer
│   ├── services-api.ts     # Public services API & UI mapper
│   └── technician-api.ts   # Technician profile & service CRUD API layer
├── proxy.ts                # Next.js 16 Edge proxy middleware & route guard
├── next.config.ts          # Rewrites configuration & image optimization
└── package.json            # Project manifest & scripts
```

---

## ⚡ Performance & SEO Optimizations

* **Image Optimization:** Uses `next/image` with AVIF/WebP formats, responsive device sizes, and domain whitelist (Cloudinary, Unsplash).
* **Package Import Tree-Shaking:** `lucide-react`, `framer-motion`, and `sonner` optimized via `experimental.optimizePackageImports`.
* **Static Prerendering & ISR:** Public catalog pages (`/services`, `/sitemap.xml`, `/robots.txt`) use static revalidation (5 mins).
* **Structured Data:** Embedded Schema.org JSON-LD scripts (`Organization`, `WebSite`, `Service`, `BreadcrumbList`).

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mahmudulkarim420/FixItNow-Frontend.git
cd FixItNow-Frontend
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL="/api"
BACKEND_URL="https://fixitnow-backend-production-4c0e.up.railway.app"
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build Verification
```bash
pnpm build
pnpm start
```
