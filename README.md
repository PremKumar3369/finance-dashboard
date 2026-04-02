# Finance Dashboard

> Built for **Zorvyn FinTech** Frontend Developer Internship Assignment

## [Live Demo](https://finance-dashboard-two-weld.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Design Decisions](#design-decisions)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [What I'd Build Next](#what-id-build-next)
- [About Me](#about-me)

---

## Overview

A **role-based personal finance dashboard** that helps users track income, expenses, and spending patterns. Built with a focus on clean UX, smooth animations, and production-ready code architecture.

### The Challenge

Build a finance dashboard UI that demonstrates:
- Component architecture and state management
- Data visualization with interactive charts
- Role-based access control (frontend simulation)
- Responsive design and dark mode support

### My Approach

Rather than building a basic CRUD app, I focused on:

1. **Real-world UX patterns** — Keyboard shortcuts, multi-format export, empty states with illustrations
2. **Performance** — Custom `requestAnimationFrame` animations, `useMemo` for all computed data
3. **Production habits** — TypeScript strict mode, localStorage persistence, proper component separation
4. **Design polish** — SVG gradient fills in charts, smooth transitions, mobile-first responsive layout

---

## Key Features

### Core Requirements

**Dashboard Overview**
- Summary cards with animated count-up (Total Balance, Income, Expenses)
- 6-month running balance trend with gradient area chart
- Spending breakdown by category with animated pie chart

**Transaction Management**
- Filterable, sortable table (search, category, type, sort by date or amount)
- Full CRUD — add, edit, delete (admin role only)
- Modal-based form with client-side validation

**Role-Based Access Control**
- **Admin** — full CRUD access
- **Viewer** — read-only, edit/delete/add controls hidden
- Animated dropdown role switcher in the header

**Insights Dashboard**
- Top spending category with count-up animation
- Month-over-month expense comparison
- Category bar chart with per-bar gradient colors
- Category progress bars with smooth width animation

**State Management**
- React Context API — no Redux needed for this scope
- `localStorage` persistence for transactions, role, and theme
- All computed values derived with `useMemo`

### Enhancements

**Dark Mode**
- Tailwind v4 custom variant (class-based, not media query)
- Persisted across sessions via `localStorage`
- Smooth color transitions on all components

**Keyboard Shortcuts**
- `Cmd/Ctrl + K` — Add transaction (admin only)
- `Cmd/Ctrl + D` — Toggle dark mode
- `1` / `2` / `3` — Navigate between tabs
- `Shift + ?` — Show shortcuts help modal

**Multi-Format Export**
- Export filtered transactions as CSV, PDF, or JSON
- Smart filename includes active filters + date (e.g. `transactions_2026-04-02_food_expense.pdf`)
- PDF uses jsPDF + autoTable for a properly formatted report

**Empty States**
- Custom inline SVG illustrations — no external image files
- Two variants: no data yet (plus icon) vs. no filter results (magnifying glass)
- Action button guides first-time users to add their first transaction

**Fully Responsive**
- Mobile-first design
- Collapsible sidebar with backdrop overlay on mobile
- All charts and tables adapt to screen size

---

## Tech Stack

| Technology | Purpose | Why This Choice |
|---|---|---|
| React 18 + TypeScript | UI and type safety | Concurrent rendering, compile-time error catching |
| Vite | Build tool | Fast HMR, instant dev server startup |
| Tailwind CSS v4 | Styling | Utility-first, minimal CSS bundle, easy dark mode |
| Recharts | Data visualization | Declarative API, SVG-based, fully customizable |
| Lucide React | Icons | Tree-shakeable, consistent design system |
| jsPDF + autoTable | PDF export | Industry standard, simple API |
| Context API | State management | Built-in React, sufficient for this scope |

### No External Dependencies For:
- Routing (tab-based with `useState`)
- Modals (custom implementation)
- Animations (CSS + `requestAnimationFrame`)
- CSV and JSON export (native browser APIs)

---

## Design Decisions

### 1. Why Context API Instead of Redux?

**Reasoning:**
- Only 3 pieces of global state: transactions, role, theme
- No complex async flows or middleware needed
- Simpler to read, test, and explain
- Smaller bundle — no extra library

If this were a real app with 20+ features, I'd use **Zustand** (minimal API) or **Redux Toolkit** (for time-travel debugging and devtools).

---

### 2. Why a Custom Count-Up Animation?

**Reasoning:**
- CSS counters don't support smooth easing curves
- `requestAnimationFrame` gives 60fps performance on any device
- Full control over timing (cubic ease-out: starts fast, decelerates at the end)
- Only 20 lines of code — no library needed

```typescript
// src/lib/useCountUp.ts
export function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}
```

---

### 3. Why Tab-Based Navigation (No React Router)?

**Reasoning:**
- Only 3 views — Dashboard, Transactions, Insights
- No deep linking or shareable URLs required
- Smaller bundle (React Router adds ~10KB gzipped)
- Tab switching with `key` prop triggers CSS animation automatically

```css
/* Each tab div remounts with a new key, restarting the animation */
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

If this needed shareable URLs or browser back/forward support, I'd use **React Router v6**.

---

### 4. Why Tailwind v4 Custom Dark Mode Variant?

**Problem:** Tailwind v4 defaults to `prefers-color-scheme` for dark mode. This means dark mode would always be on for users with a dark OS — ignoring the in-app toggle.

**Fix:**
```css
/* src/index.css */
@custom-variant dark (&:where(.dark, .dark *));
```

Now `dark:` utilities only apply when the `.dark` class exists on `<html>`. `ThemeContext` adds/removes that class on every toggle.

---

### 5. Why SVG Gradients Inside Recharts?

**Reasoning:**
- Gradients make charts feel premium and guide the eye better than flat colors
- Recharts renders inside an SVG, so standard `<defs>` + `<linearGradient>` / `<radialGradient>` work natively
- Zero extra code — just reference the gradient by ID in the `stroke` or `fill` prop

```tsx
<defs>
  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stopColor="#818cf8" />
    <stop offset="50%"  stopColor="#2563eb" />
    <stop offset="100%" stopColor="#06b6d4" />
  </linearGradient>
</defs>
<Area stroke="url(#lineGradient)" ... />
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/premkumarsaravanan/finance-dashboard.git
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

### Reset Data

To reset back to mock data, clear `localStorage` in browser DevTools:
**Application → Local Storage → right-click → Clear**

---

## Project Structure

```
src/
├── main.tsx                         # App entry point
├── App.tsx                          # Root — tab routing, filter state, keyboard shortcuts
├── index.css                        # Tailwind + dark mode variant + keyframes
│
├── types/index.ts                   # TypeScript interfaces
│
├── lib/
│   ├── mockData.ts                  # 18 seed transactions + CATEGORIES
│   ├── useCountUp.ts                # Count-up animation hook (requestAnimationFrame)
│   ├── exportUtils.ts               # CSV, PDF, JSON export functions
│   └── utils.ts                     # cn() helper (clsx + tailwind-merge)
│
├── hooks/
│   └── useKeyboardShortcuts.ts      # Global keyboard shortcut manager
│
├── context/
│   ├── FinanceContext.tsx           # Transactions, role, CRUD, computed summary
│   └── ThemeContext.tsx             # Theme state + .dark class sync on <html>
│
└── components/
    ├── layout/
    │   ├── Header.tsx               # Logo, role dropdown, shortcuts button, theme toggle
    │   ├── Sidebar.tsx              # Tab navigation, mobile drawer
    │   └── MainLayout.tsx           # Page shell
    ├── dashboard/
    │   ├── SummaryCards.tsx         # 3 stat cards with count-up animation
    │   ├── BalanceTrendChart.tsx    # 6-month area chart with SVG gradient
    │   └── SpendingBreakdownChart.tsx # Pie chart with radial gradients
    ├── transactions/
    │   ├── TransactionFilters.tsx   # Search, filters, multi-format export dropdown
    │   ├── TransactionTable.tsx     # Data table with empty states
    │   └── TransactionModal.tsx     # Add / edit form
    ├── insights/
    │   └── InsightsSection.tsx      # Stat cards, bar chart, progress bars
    └── ui/
        ├── ChartTooltip.tsx         # Custom tooltip for all 3 charts
        ├── EmptyState.tsx           # Reusable empty state with illustration
        ├── EmptyStateIllustration.tsx # Inline SVG — no-data and no-results variants
        └── ShortcutsHelpModal.tsx   # Keyboard shortcuts reference modal
```

**Total Components:** 20 | **Custom Hooks:** 2 | **Context Providers:** 2 | **TypeScript Interfaces:** 5

---

## What I'd Build Next

If this were a real production app with more time:

**Phase 2 — Backend**
- REST API with Node.js + Express or Next.js API routes
- PostgreSQL for persistent storage
- JWT authentication to replace the role dropdown

**Phase 2 — Features**
- Monthly budget limits per category with threshold warnings
- Recurring transaction templates (auto-generate monthly bills)
- CSV import — upload a bank statement and auto-categorize rows
- Date range picker for custom reporting windows
- Year-over-year comparison chart
- PDF report with charts embedded (not just a table)

**Phase 2 — Quality**
- Unit tests with Jest + React Testing Library for context and hooks
- E2E tests with Playwright for critical user flows
- Error boundary components for graceful failures
- Accessibility audit — focus management, ARIA labels, keyboard nav

---

## About Me

**Prem Kumar** — Frontend Developer, Bengaluru, Karnataka

- Email: premkumar.as.work@gmail.com
- LinkedIn: [linkedin.com/in/premkumar-as](https://linkedin.com/in/premkumar-as)
- GitHub: [@premkumarsaravanan](https://github.com/premkumarsaravanan)
- Portfolio: [vorvea.com](https://vorvea.com)

Currently completing MCA at East West Institute of Management. Previously built production tools at Hrlabs (project management SaaS) and freelance under the Vorvea brand.

**Tech Stack:** React, TypeScript, Java Spring Boot, Tailwind CSS, PostgreSQL

---

## License

Built as an internship assignment for Zorvyn FinTech. Free to use as a learning reference.
