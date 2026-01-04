import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", auth, async (req: any, res) => {
  const userId = req.userId;

  const paid = await prisma.expensePayer.aggregate({
    where: { userId },
    _sum: { amountCents: true }
  });

  const owed = await prisma.expenseBeneficiary.aggregate({
    where: { userId },
    _sum: { amountCents: true }
  });

  const byGroup = await prisma.expense.groupBy({
    by: ["groupId"]
  });

  res.json({
    totalPaid: paid._sum.amountCents || 0,
    totalOwed: owed._sum.amountCents || 0,
    net: (paid._sum.amountCents || 0) - (owed._sum.amountCents || 0),
    groups: byGroup,
  });
});

export default router;
