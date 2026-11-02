// Sources: repo READMEs, docs and package.json files (content/raw/github.json, fetched 2026-11-03) + docs/cv.pdf.
// No repo has a live link yet, so every liveUrl is null. Owner will deploy the 3 featured projects as seeded demos before launch.
// inventory-manager: repo is being renamed from "-inventory-app-ai" (owner, 2026-11-03); GitHub redirects the old URL.

export type Project = {
  slug: string;
  repo: string;
  title: string;
  tagline: string;
  description: string; // ≤ 25 words, used on cards
  features: [string, string, string];
  stack: string[];
  category: "FULL-STACK" | "E-COMMERCE" | "WEB APP";
  status: "live" | "in progress" | "source only";
  role: string;
  liveUrl: string | null;
  sourceUrl: string;
  challenge: string;
  solution: string;
  signals: { commits: number; tests: string | null; ci: boolean };
  featured: boolean;
};

const gh = (repo: string) => `https://github.com/parisa-adli/${repo}`;

export const projects: Project[] = [
  {
    slug: "inventory-manager",
    repo: "inventory-manager",
    title: "Inventory Manager",
    tagline: "A stock ledger that can't drift.",
    description:
      "Full-stack inventory system in a TypeScript monorepo, with email and Telegram sign-in, role-based access and an audit-proof stock ledger.",
    features: [
      "Email + Telegram (QR / one-time code) sign-in with rotating JWT refresh cookies",
      "Admin / Staff roles from a single permission table, enforced on the server",
      "Every stock change is a ledger movement, plus a Recharts dashboard",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "TanStack Query", "Express 5", "MongoDB", "Zod", "Playwright", "Vitest"],
    category: "FULL-STACK",
    status: "source only",
    role: "Solo — design, client, server and tests",
    liveUrl: null,
    sourceUrl: gh("inventory-manager"),
    challenge: "Stock quantities silently drift from what actually happened.",
    solution:
      "Quantity is derived from an append-only movement ledger written in the same operation, with an admin reconciliation check.",
    signals: { commits: 104, tests: "Vitest + Supertest (server), Playwright E2E", ci: true },
    featured: true,
  },
  {
    slug: "nexaivon",
    repo: "NEXAIVON",
    title: "NEXAIVON",
    tagline: "Tech & gadgets store, cart to checkout.",
    description:
      "Full-stack tech and gadgets e-commerce store with an admin panel, coupons, online payment and SMS one-time-code login.",
    features: [
      "Cart, coupons and Zarinpal online payment",
      "SMS OTP login, JWT cookies and protected routes",
      "Admin panel for products, categories and image uploads",
    ],
    stack: ["Next.js 15", "React", "Tailwind CSS", "React Query", "Express", "MongoDB", "Vitest"],
    category: "E-COMMERCE",
    status: "source only",
    role: "Solo — client and server",
    liveUrl: null,
    sourceUrl: gh("NEXAIVON"),
    challenge: "Two shoppers can buy the last item at the same time.",
    solution:
      "Stock is validated on add-to-cart and payment, then decremented conditionally per quantity, with compensation if a step fails.",
    signals: { commits: 66, tests: "Vitest + Supertest (server)", ci: false },
    featured: true,
  },
  {
    slug: "workbridge",
    repo: "WorkBridge",
    title: "WorkBridge",
    tagline: "Where project owners meet freelancers.",
    description:
      "Freelancing platform: owners post projects, freelancers send proposals, admins manage users. Phone login by SMS one-time code.",
    features: [
      "OTP phone login, then profile completion with a role",
      "Owners manage projects and accept or reject proposals",
      "Admin user verification, dark mode and Persian (RTL) dates",
    ],
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "TanStack Query", "React Hook Form", "Zod", "Express", "MongoDB", "Playwright", "Vitest"],
    category: "WEB APP",
    status: "source only",
    role: "Solo — client and server",
    liveUrl: null,
    sourceUrl: gh("WorkBridge"),
    challenge: "Three roles share one app but must see very different things.",
    solution:
      "Feature-based client with role-guarded routes, backed by an Express API with per-role endpoints.",
    signals: { commits: 66, tests: "Vitest, Playwright E2E", ci: true },
    featured: true,
  },
  {
    slug: "blog-app",
    repo: "Next.js-blog-app",
    title: "Blog App",
    tagline: "Publishing, with an admin desk.",
    description:
      "Blog platform with an admin dashboard for posts, comments, categories and users, server-rendered for SEO.",
    features: [
      "Admin dashboard for posts, comments, categories and users",
      "Server-side rendering and dynamic routes for SEO",
      "Validated forms and pagination built from reusable components",
    ],
    stack: ["Next.js 15", "React 19", "Tailwind CSS", "React Query", "React Hook Form", "Yup"],
    category: "WEB APP",
    status: "source only",
    role: "Solo — frontend",
    liveUrl: null,
    sourceUrl: gh("Next.js-blog-app"),
    challenge: "Blog posts need to rank in search, but the admin side is a heavy, interactive app.",
    solution:
      "Public pages are server-rendered with dynamic routes for SEO; the admin dashboard runs on React Query with shared hooks and paginated tables.",
    signals: { commits: 81, tests: null, ci: false },
    featured: false,
  },
  {
    slug: "stays",
    repo: "React-Booking-Hotel_App",
    title: "Stays",
    tagline: "Find a place, see it on the map.",
    description:
      "Hotel and short-stay search with list and map views, filters, favourites and shareable searches. Demo data from Inside Airbnb.",
    features: [
      "Destination, date-range and guest search kept in the URL",
      "List + map split view with price-pill markers",
      "Filters, sorting, pagination, favourites and map bookmarks",
    ],
    stack: ["React 18", "React Router", "Context API", "Axios", "React-Leaflet", "JSON Server"],
    category: "WEB APP",
    status: "source only",
    role: "Solo — frontend",
    liveUrl: null,
    sourceUrl: gh("React-Booking-Hotel_App"),
    challenge: "Search results you can't share or reload are useless.",
    solution: "All search, filter and sort state lives in the URL, so any result page is a link.",
    signals: { commits: 35, tests: "Node test runner (unit)", ci: false },
    featured: false,
  },
];
