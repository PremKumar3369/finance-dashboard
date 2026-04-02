# Finance Dashboard UI

A clean, interactive finance dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- Dashboard overview with summary cards and charts
- Transaction management with filtering and sorting
- Role-based UI (Admin / Viewer mode)
- Financial insights and analytics
- Dark mode support
- Data persistence with localStorage
- Fully responsive design

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

- **State Management**: React Context API — `FinanceContext` for data, `ThemeContext` for theme
- **Data Persistence**: All transactions and preferences saved to `localStorage`
- **Role System**: Toggle between Admin (full CRUD) and Viewer (read-only) in the header dropdown
- **Filtering**: Search by text, filter by category/type, sort by date or amount

## Project Structure

```
src/
├── types/            # TypeScript interfaces
├── lib/              # Mock data and utilities
├── context/          # Global state (Finance + Theme)
├── components/
│   ├── layout/       # Header, Sidebar, MainLayout
│   ├── dashboard/    # Summary cards + charts
│   ├── transactions/ # Table, filters, add/edit modal
│   └── insights/     # Analytics section
└── App.tsx           # Root component + tab routing
```

## Live Demo

https://finance-dashboard-two-weld.vercel.app

## Author

Prem Kumar — Frontend Developer
