import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

//
// Create settlement request
//
router.post("/", auth, async (req: any, res) => {
  const { groupId, toUser, amountCents, note } = req.body;

  const settlement = await prisma.settlement.create({
    data: {
      groupId,
      fromUser: req.userId,
      toUser,
      amountCents,
      note,
      status: "pending"
    }
  });

  res.json(settlement);
});

//
// Approve or reject
//
router.post("/respond", auth, async (req: any, res) => {
  const { settlementId, status } = req.body;

  const settlement = await prisma.settlement.update({
    where: { id: settlementId },
    data: { status }
  });

  // if accepted → create ledger entry
  if (status === "accepted") {
    await prisma.ledgerEntry.create({
      data: {
        groupId: settlement.groupId,
        fromUser: settlement.fromUser,
        toUser: settlement.toUser,
        amountCents: settlement.amountCents,
        type: "settlement"
      }
    });
  }

  res.json(settlement);
});

//
// List group settlements
//
router.get("/group/:groupId", auth, async (req, res) => {
  const { groupId } = req.params;

  const settlements = await prisma.settlement.findMany({
    where: { groupId }
  });

  res.json(settlements);
});

export default router;
