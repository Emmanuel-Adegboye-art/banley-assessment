

# Restaurant Tip Manager

A Restaurant Tip Manager application built with React, TypeScript, and shadcn/ui.

---

## Project Overview

This is a base application for the Banley internship assessment. The application allows users to manage restaurants and calculate tips.

**Already Built:**
- Restaurant CRUD (Create, Read, Update, Delete)
- Dashboard with charts and stats
- Sidebar navigation with theme switcher
- Database layer with IndexedDB
- Services for data operations

**Your Task:**
Build the complete **Tips** page functionality. See the assessment instructions for details.

---

## Tech Stack

- React 19+
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Dexie.js (IndexedDB wrapper)
- Sonner (toasts)
- Recharts (charts)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Kudagon/banley-assessment.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (sidebar, header)
│   └── ui/              # shadcn/ui components
├── lib/
│   └── database.ts      # Dexie database setup
├── pages/
│   ├── Dashboard.tsx    # Dashboard page (complete)
│   ├── Restaurants.tsx  # Restaurants page (complete)
│   └── Tips.tsx         # Tips page (your task)
├── services/
│   ├── BaseModel.ts     # Base service with CRUD operations
│   ├── restaurant.service.ts
│   ├── calculation.service.ts
│   └── README.md        # Services documentation
├── providers/
│   └── ThemeProvider.tsx
└── App.tsx
```

---

## Services

The application uses a service layer to handle data operations with IndexedDB.

**Key Services:**
- `RestaurantService` — Manage restaurants
- `CalculationService` — Manage tip calculations

**Documentation:** See `src/services/README.md`

---

## Database

The application uses IndexedDB via Dexie.js. The database schema includes:

- `restaurants` — Store restaurant data
- `calculations` — Store tip calculations

---

## Assessment Instructions

Full assessment details are available in the assessment document. Key tasks:

1. Complete the Tips page functionality
2. Submit via pull request
3. Record a video walkthrough
4. Post on LinkedIn with @kudagon

---

## License

This project is for assessment purposes only.

---

## Support

For questions during the assessment, comment on your issue or message @kudagon on LinkedIn.