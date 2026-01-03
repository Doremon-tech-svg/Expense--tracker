import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();


//
// HELPERS
//
async function createExpenseForGroup(body: any, userId: string) {
  const {
    groupId,
    reason,
    paymentMethod,
    expenseDate,
    beneficiaries,
    payers,
  } = body;

  return prisma.expense.create({
    data: {
      groupId,
      createdBy: userId,
      reason,
      paymentMethod,
      status: "pending",
      expenseDate,

      payers: {
        create: payers?.map((p: any) => ({
          userId: p.userId,
          amountCents: p.amountCents,
        })),
      },

      beneficiaries: {
        create: beneficiaries?.map((b: any) => ({
          userId: b.userId,
          amountCents: b.amountCents,
        })),
      },
    },
    include: {
      payers: true,
      beneficiaries: true,
    },
  });
}

//
// NEW — POST /groups/:groupId/expenses
//
router.post("/groups/:groupId/expenses", auth, async (req: any, res) => {
  try {
    const expense = await createExpenseForGroup(
      { ...req.body, groupId: req.params.groupId },
      req.userId
    );

    res.json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

//
// LEGACY — POST /expenses
//
router.post("/expenses", auth, async (req: any, res) => {
  try {
    const expense = await createExpenseForGroup(req.body, req.userId);
    res.json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create expense" });
  }
});


//
// LIST — NEW: GET /groups/:groupId/expenses
//
router.get("/groups/:groupId/expenses", auth, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { groupId: req.params.groupId },
      orderBy: { expenseDate: "desc" },
      include: {
        payers: true,
        beneficiaries: true,
      },
    });

    res.json(expenses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load expenses" });
  }
});

//
// LIST — LEGACY: GET /expenses/group/:groupId
//
router.get("/expenses/group/:groupId", auth, async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { groupId: req.params.groupId },
      orderBy: { expenseDate: "desc" },
      include: {
        payers: true,
        beneficiaries: true,
      },
    });

    res.json(expenses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load expenses" });
  }
});

export default router;
