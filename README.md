# 💸 Group Expense App (MVP)

A **mobile‑first group expense, debt, and settlement tracking web application**, inspired by Splitwise but intentionally designed to prioritize **accuracy, transparency, and auditability** over shortcuts.

This project is an **MVP scaffold**, suitable for **small groups (10–20 people)** who want a shared, trustworthy financial ledger rather than a quick‑and‑dirty splitter.

---

## ✨ Key Principles

* **Approval‑based expenses** – no silent changes
* **Full transparency** – every amount is traceable
* **Auditability** – data model favors correctness
* **Accuracy > convenience** – intentional trade‑offs

---

## 🏗 High‑Level Architecture

### Tech Stack

#### Frontend

* React + TypeScript
* Vite
* React Router
* TanStack React Query
* Axios
* TailwindCSS (functional styling, not yet polished)

#### Backend

* Node.js + Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT authentication (HTTP‑only cookies)

---

## 🧠 Core Domain Model (Prisma Schema Overview)

### User

* `id`
* `email`
* `name`
* `password`
* `privacyPublicDashboard`

### Group

* `id`
* `name`
* `members`
* `expenses`

### GroupMember

* `userId`
* `groupId`
* `role` (ADMIN | MEMBER)
* `canManageExpenses`

### Expense

* `groupId`
* `createdBy`
* `reason`
* `paymentMethod`
* `expenseDate`
* `status` (pending | active)
* `payers`
* `beneficiaries`

### ExpensePayer

* `userId`
* `amountCents`

### ExpenseBeneficiary

* `userId`
* `amountCents`

### Approval

* `entityType` (expense)
* `entityId`
* `userId`
* `status`

### LedgerEntry

* `groupId`
* `fromUser`
* `toUser`
* `amountCents`
* `type`

### Settlement

* `groupId`
* `fromUser`
* `toUser`
* `amountCents`
* `status`

---

## ✅ Functional Scope (Current State)

### Authentication

* Signup & Login
* JWT issued on login
* JWT stored in HTTP‑only cookie
* Middleware validates cookie or Authorization header

### Groups

* Create group
* Creator auto‑added as ADMIN
* List user’s groups
* View group details

### Expenses (Basic)

* Add expense to a group
* Multiple payers
* Multiple beneficiaries
* Expenses start in `pending` state
* Visible in group expense list

### Approvals (Partial)

* Approval records exist in DB
* Backend logic drafted
* ❌ UI not implemented yet

### Ledger (Draft)

* Ledger generation logic exists
* ❌ Not fully validated

### Dashboard (Basic)

* Total paid
* Total owed
* Net balance
* Group summary placeholder

---

## 🧭 Frontend Structure

```
frontend/src
├── api/
│   └── client.ts
├── components/
│   └── AddExpense.tsx
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Groups.tsx
│   └── GroupDetail.tsx
├── App.tsx
└── main.tsx
```

### Navigation

* Global layout with header
* Links: Dashboard | Groups | Logout
* Logout clears auth cookie

---

## 🗄 Backend Structure

```
backend/src
├── routes/
│   ├── auth.ts
│   ├── groups.ts
│   ├── expenses.ts
│   ├── approvals.ts
│   ├── settlements.ts
│   └── dashboard.ts
├── middleware/
│   └── auth.ts
├── server.ts
└── prisma/
    └── schema.prisma
```

---

## ⚠️ Major Issues Encountered (Important Context)

### Prisma Version Instability

* Prisma v7 introduced breaking changes
* Datasource URL moved to `prisma.config.ts`
* Migration failures until version stabilized

### Authentication Confusion

* Initially mixed header‑based tokens and cookies
* Caused frequent `401` errors
* Resolved by:

  * Correct CORS configuration
  * `withCredentials: true`
  * Cookie parsing middleware

### CORS Misconfiguration

* `credentials: true` + `origin: "*"` caused blocking
* Fixed by explicitly allowing `http://localhost:5173`

### Route Mismatches

* Frontend called `/expenses`
* Backend router mounted incorrectly
* Resulted in repeated `404` errors

### UI Instability

* Dashboard crashed on `401` API responses
* Fixed via defensive rendering

### Scope Creep

* Tried to implement members, approvals, dashboard, and ledger simultaneously
* Decision made to **stabilize navigation and core flows first**

---

## 📌 Current Status

✔ App runs end‑to‑end
✔ Authentication works
✔ Groups load correctly
✔ Expenses can be created
✔ Dashboard loads

❌ Approval UX incomplete
❌ Ledger math unverified
❌ Member management temporarily removed
❌ UI needs polish

⚠️ **This is an MVP scaffold — not production ready.**

---

## 🛣 Roadmap

### Phase 1 — Stability

* Lock routes & API contracts
* Clean approval logic
* Ensure expense list refreshes correctly

### Phase 2 — Approvals

* Show pending approvals per user
* Approve / reject expenses
* Activate expense only after threshold

### Phase 3 — Ledger

* Correct debt calculation
* Net off ledger entries
* Group‑level balances

### Phase 4 — UX

* Improved expense form
* Member selection UI
* Filters
* Mobile polish

---

## ▶️ Running the Project

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

> PostgreSQL must be running and `DATABASE_URL` must be set.

---

## 🤖 Important Note for Future AI Agents

This project:

* Is **incrementally built**
* Contains **intentionally paused / partial features**
* Prioritizes **correctness over speed**

🚫 Do **not** refactor everything at once.

✅ Pick **one domain** (auth, groups, expenses, approvals, ledger) and stabilize it fully before moving on.

---

*End of README*
