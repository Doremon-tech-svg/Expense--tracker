import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

//
// Personal dashboard
//
router.get("/me", auth, async (req: any, res) => {
  const userId = req.userId;

  const ledger = await prisma.ledgerEntry.findMany({
    where: {
      OR: [{ fromUser: userId }, { toUser: userId }]
    }
  });

  let totalOwed = 0;      // I owe others
  let totalReceivable = 0; // others owe me

  ledger.forEach(entry => {
    if (entry.fromUser === userId) totalOwed += entry.amountCents;
    if (entry.toUser === userId) totalReceivable += entry.amountCents;
  });

  res.json({
    totalOwed,
    totalReceivable,
    net: totalReceivable - totalOwed
  });
});

export default router;


//
// Group dashboard
//
router.get("/group/:groupId", auth, async (req, res) => {
  const { groupId } = req.params;

  const expenses = await prisma.expense.findMany({
    where: { groupId, status: "active" }
  });

  const ledger = await prisma.ledgerEntry.findMany({
    where: { groupId }
  });

  const totalExpenses = expenses.length;

  let totalAmount = 0;
  ledger.forEach(l => (totalAmount += l.amountCents));

  res.json({
    totalExpenses,
    totalLedgerVolume: totalAmount,
    activeMembers: await prisma.groupMember.count({ where: { groupId } })
  });
});
