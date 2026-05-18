# SpendTrack — Expense Tracker
**Group N | Computer Science 200-Level React Project**

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/spendtrack-expense-tracker.git
cd spendtrack-expense-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login
- **Email:** demo@spendtrack.ng
- **Password:** demo1234

---

## 📁 Project Structure

```
src/
├── context/
│   └── ExpenseContext.jsx    # Global state (useState, useEffect)
├── components/
│   ├── Navbar.jsx            # Navigation bar (React Router links)
│   └── Navbar.css
├── pages/
│   ├── Dashboard.jsx         # Home dashboard with stats & charts
│   ├── Dashboard.css
│   ├── AddExpense.jsx        # Add expense form
│   ├── AddExpense.css
│   ├── History.jsx           # Full expense history with search/filter/edit/delete
│   ├── History.css
│   ├── Charts.jsx            # Bar, Pie, Line charts (Recharts)
│   ├── Charts.css
│   ├── Monthly.jsx           # Monthly summary with category breakdown
│   ├── Monthly.css
│   ├── Auth.jsx              # Login & Register pages
│   ├── Auth.css
│   ├── Settings.jsx          # Settings & Profile pages
│   ├── Settings.css
│   └── Misc.jsx              # 404 page & Footer
├── App.jsx                   # Router setup, protected routes
├── index.js                  # Entry point
└── index.css                 # Global styles & CSS variables
```

---

## ✅ React Concepts Used

| Concept | Where Used |
|---|---|
| `useState` | Form state, filters, toggles in every page |
| `useEffect` | LocalStorage sync in ExpenseContext |
| `useContext` | Global expense data across all pages |
| `useMemo` | Filtered/computed expense data |
| `React Router v6` | All page navigation, protected routes |
| `Props` | Components receive data via props |
| `Event Handling` | Forms, buttons, search, select filters |
| `Forms Handling` | Add expense form with validation |
| `API (local JSON)` | Demo expenses seeded as local data |

---

## 📄 Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | User authentication |
| Register | `/register` | Create new account |
| Dashboard | `/` | Stats, budget progress, recent expenses, pie chart |
| Add Expense | `/add` | Form to add new expense with category picker |
| History | `/history` | All expenses with search, filter, sort, edit, delete |
| Charts | `/charts` | Bar, line, pie charts by category/month/day |
| Monthly | `/monthly` | Month-by-month summary with weekly breakdown |
| Settings | `/settings` | Budget, income settings, data export |
| Profile | `/profile` | Update user info |
| 404 | `*` | Error page |

---

## 🛠️ Tools & Technologies

- **React 18** — UI framework
- **React Router v6** — Client-side routing
- **Recharts** — Charts and data visualization
- **localStorage** — Data persistence
- **CSS3** — Custom styling with CSS variables
- **uuid** — Unique IDs for expenses

---

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Drag and drop the /build folder to netlify.com/drop
```

---

## 👥 Group Members

| Name | Matric No. |
|---|---|
| [Member 1] | [Matric] |
| [Member 2] | [Matric] |
| [Member 3] | [Matric] |
| [Member 4] | [Matric] |
| [Member 5] | [Matric] |

---

## 📧 Submission
Send to: **ogungbuyivictor@gmail.com**
Deadline: **June 12th, 2026**
