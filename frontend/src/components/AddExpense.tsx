import { useState } from "react";
import { api } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useGroupMembers } from "../hooks/useGroupMembers";

export default function AddExpense({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) {
  const client = useQueryClient();
  const { data: members = [] } = useGroupMembers(groupId);

  const [reason, setReason] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [payerSplits, setPayerSplits] = useState<any[]>([]);
  const [beneficiarySplits, setBeneficiarySplits] = useState<any[]>([]);

  function togglePayer(userId: string) {
    if (payerSplits.find((p) => p.userId === userId)) {
      setPayerSplits(payerSplits.filter((p) => p.userId !== userId));
    } else {
      setPayerSplits([
        ...payerSplits,
        { userId, amountCents: 0 },
      ]);
    }
  }

  function toggleBeneficiary(userId: string) {
    if (beneficiarySplits.find((p) => p.userId === userId)) {
      setBeneficiarySplits(
        beneficiarySplits.filter((p) => p.userId !== userId)
      );
    } else {
      setBeneficiarySplits([
        ...beneficiarySplits,
        { userId, amountCents: 0 },
      ]);
    }
  }

  function updatePayerAmount(userId: string, value: string) {
    setPayerSplits(
      payerSplits.map((p) =>
        p.userId === userId
          ? { ...p, amountCents: Math.round(parseFloat(value || "0") * 100) }
          : p
      )
    );
  }

  function updateBeneficiaryAmount(userId: string, value: string) {
    setBeneficiarySplits(
      beneficiarySplits.map((p) =>
        p.userId === userId
          ? { ...p, amountCents: Math.round(parseFloat(value || "0") * 100) }
          : p
      )
    );
  }

  async function submit(e: any) {
    e.preventDefault();

    await api.post("/expenses", {
      groupId,
      reason,
      expenseDate: new Date(date).toISOString(),
      paymentMethod,
      payers: payerSplits,
      beneficiaries: beneficiarySplits,
    });

    await client.invalidateQueries({ queryKey: ["group-expenses", groupId] });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded p-4 w-[95%] max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="font-bold mb-2">Add Expense</h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="border w-full p-2 rounded"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <input
            type="date"
            className="border w-full p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <select
            className="border w-full p-2 rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <div>
            <h3 className="font-medium mb-1">Payers</h3>
            {members.map((m: any) => (
              <div key={m.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  onChange={() => togglePayer(m.id)}
                  checked={!!payerSplits.find((p) => p.userId === m.id)}
                />
                <span className="flex-1">{m.name}</span>

                {payerSplits.find((p) => p.userId === m.id) && (
                  <input
                    className="border p-1 rounded w-20"
                    type="number"
                    placeholder="0"
                    onChange={(e) =>
                      updatePayerAmount(m.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-medium mb-1">Beneficiaries</h3>
            {members.map((m: any) => (
              <div key={m.id} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  onChange={() => toggleBeneficiary(m.id)}
                  checked={
                    !!beneficiarySplits.find((p) => p.userId === m.id)
                  }
                />
                <span className="flex-1">{m.name}</span>

                {beneficiarySplits.find((p) => p.userId === m.id) && (
                  <input
                    className="border p-1 rounded w-20"
                    type="number"
                    placeholder="0"
                    onChange={(e) =>
                      updateBeneficiaryAmount(m.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <button className="bg-green-600 text-white p-2 rounded w-full">
            Save & Request Approvals
          </button>

          <button
            type="button"
            className="text-center w-full text-sm mt-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
