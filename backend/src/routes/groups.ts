import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

//
// CREATE GROUP
//
router.post("/", auth, async (req: any, res) => {
  try {
    const { name } = req.body;

    const group = await prisma.group.create({
      data: {
        name,

        members: {
          create: [
            {
              userId: req.userId,      // 👈 correct
              role: "ADMIN",
              canManageExpenses: true,
            },
          ],
        },
      },

      // 👇 include MUST be outside "data"
      include: {
        members: true,
      },
    });

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create group" });
  }
});

//
// LIST GROUPS USER BELONGS TO
//
router.get("/", auth, async (req: any, res) => {
  const groups = await prisma.groupMember.findMany({
    where: { userId: req.userId }, // 👈 fix
    include: { group: true },
  });

  res.json(groups);
});

//
// GET MEMBERS IN GROUP
//
router.get("/:groupId/members", auth, async (req, res) => {
  const { groupId } = req.params;

  const members = await prisma.groupMember.findMany({
    where: { groupId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  res.json(
    members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
    }))
  );
});

export default router;
