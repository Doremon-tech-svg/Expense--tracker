# Group Expense App (MVP)

## 1. What this project is

This is a **mobile‑first group expense, debt, and settlement tracking web application**, similar in concept to Splitwise, but designed with:

* Approval‑based expenses
* Full transparency
* Auditability
* Accuracy over convenience

The app is intended for **small groups (10–20 people)** who want a shared financial ledger.

---

## 2. High‑level architecture

### Tech stack

**Frontend**

* React + TypeScript
* Vite
* React Router
* TanStack React Query
* Axios
* TailwindCSS (basic styling, not fully polished yet)

**Backend**

* Node.js + Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT authentication (stored in HTTP‑only cookies)

---

## 3. Core domain model (Prisma schema)

### User

* id
* email
* name
* password
* privacyPublicDashboard

### Group

* id
* name
* members
* expenses

### GroupMember

* userId
* groupId
* role (ADMIN / MEMBER)
* canManageExpenses

### Expense

* groupId
* createdBy
* reason
* paymentMethod
* expenseDate
* status (pending | active)
* payers
* beneficiaries

### ExpensePayer

* userId
* amountCents

### ExpenseBeneficiary

* userId
* amountCents

### Approval

* entityType (expense)
* entityId
* userId
* status

### LedgerEntry

* groupId
* fromUser
* toUser
* amountCents
* type

### Settlement

* groupId
* fromUser
* toUser
* amountCents
* status

---

## 4. Functional scope implemented so far

### ✅ Authentication

* Signup & Login
* JWT issued on login
* JWT stored in HTTP‑only cookie
* Middleware validates cookie or Authorization header

### ✅ Groups

* Create group
* Creator auto‑added as ADMIN
* List groups user belongs to
* View group details

### ✅ Expenses (basic)

* Add expense to a group
* Multiple payers
* Multiple beneficiaries
* Expense created in `pending` state
* Expense visible in group list

### ⚠️ Approvals (partial)

* Approval records exist in DB
* Backend logic drafted
* UI for approvals not implemented yet

### ⚠️ Ledger

* Ledger generation logic drafted
* Not fully validated yet

### ✅ Dashboard (basic)

* Total paid
* Total owed
* Net balance
* Group summary placeholder

---

## 5. Current frontend structure

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

## 6. Backend structure

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

## 7. Major problems encountered (important context for AI agent)

### Prisma version issues

* Prisma v7 introduced breaking changes
* Datasource URL moved to `prisma.config.ts`
* Migration failures until version stabilized

### Authentication confusion

* Initially mixed token‑in‑header and cookie auth
* Resulted in frequent 401 errors
* Resolved by:

  * Proper CORS config
  * `withCredentials: true`
  * Cookie parsing middleware

### CORS errors

* Using `credentials: true` with `origin: "*"` caused blocking
* Fixed by explicitly allowing `http://localhost:5173`

### Route mismatches

* Frontend called `/expenses`
* Backend mounted `/expenses` router incorrectly
* Resulted in repeated 404s

### UI instability

* Dashboard crashed when API returned 401
* Fixed by defensive rendering

### Scope creep

* Tried to implement:

  * members
  * approvals
  * dashboard
  * ledger
    all at once
* Decision taken to **stabilize navigation + core flows first**

---

## 8. Current status (important)

✔ App runs end‑to‑end
✔ Login works
✔ Groups load
✔ Expenses can be created
✔ Dashboard loads

❌ Approval UX not complete
❌ Ledger math not verified
❌ Member management temporarily removed
❌ UI needs polishing

This is an **MVP scaffold**, not production ready.

---

## 9. What should be done next (clear roadmap)

### Phase 1 (Stability)

* Lock routes & API contracts
* Clean approvals table logic
* Ensure expense list refresh after creation

### Phase 2 (Approvals)

* Show pending approvals per user
* Approve / reject expense
* Activate expense only after threshold

### Phase 3 (Ledger)

* Correct debt calculation
* Net off ledger entries
* Group‑level balances

### Phase 4 (UX)

* Better expense form
* Member selection UI
* Filters
* Mobile polish

---

## 10. How to run the project

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

Postgres must be running and `DATABASE_URL` set.

---

## 11. Important note for future AI agents

This project:

* Is **incrementally built**
* Has **known broken/partial features** intentionally paused
* Prioritizes correctness over speed

Do **not** refactor everything at once.
Fix one domain (auth / groups / expenses / approvals) fully before moving on.

---

End of summary.
