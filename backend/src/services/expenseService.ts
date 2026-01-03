import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createExpense(data: any) {
  const {
    groupId,
    createdBy,
    reason,
    expenseDate,
    payers,
    beneficiaries
  } = data;

  // create expense
  const expense = await prisma.expense.create({
    data: {
      groupId,
      createdBy,
      reason,
      expenseDate,
      status: "pending",
      payers: {
        create: payers.map((p: any) => ({
          userId: p.userId,
          amountCents: p.amountCents
        }))
      },
      beneficiaries: {
        create: beneficiaries.map((b: any) => ({
          userId: b.userId,
          amountCents: b.amountCents
        }))
      }
    },
    include: { payers: true, beneficiaries: true }
  });

  // affected users = anyone who pays or benefits
  const affected = [
    ...new Set([
      ...payers.map((p: any) => p.userId),
      ...beneficiaries.map((b: any) => b.userId)
    ])
  ];

  // create approval records
  await prisma.approval.createMany({
    data: affected.map((u) => ({
      entityType: "expense_create",
      entityId: expense.id,
      userId: u,
      status: "pending"
    }))
  });

  return expense;
}
