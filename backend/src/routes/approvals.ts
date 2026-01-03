import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { entityId, userId, status } = req.body;

  await prisma.approval.updateMany({
    where: { entityId, userId },
    data: { status }
  });

  const approvals = await prisma.approval.findMany({
    where: { entityId }
  });

  const allApproved = approvals.every(a => a.status === "approved");

  if (allApproved) {
    await prisma.expense.update({
      where: { id: entityId },
      data: { status: "active" }
    });

    const expense = await prisma.expense.findUnique({
      where: { id: entityId },
      include: { payers: true, beneficiaries: true }
    });

    if (expense) {
      // generate ledger records
      for (const b of expense.beneficiaries) {
        for (const p of expense.payers) {
          if (b.userId !== p.userId) {
            await prisma.ledgerEntry.create({
              data: {
                groupId: expense.groupId,
                fromUser: b.userId,
                toUser: p.userId,
                amountCents: b.amountCents,
                type: "expense"
              }
            });
          }
        }
      }
    }
  }

  res.json({ ok: true });
});

export default router;
