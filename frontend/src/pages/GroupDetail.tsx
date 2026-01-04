import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useState } from "react";
import AddExpense from "../components/AddExpense";
import axios from "axios";

function AddMember({ groupId, refetch }: any) {
  const [email, setEmail] = useState("");

  async function submit(e: any) {
    e.preventDefault();

    await axios.post(
      `http://localhost:4000/groups/${groupId}/members`,
      { email },
      { withCredentials: true }
    );

    setEmail("");
    refetch();
  }

  return (
   
    <form onSubmit={submit} className="flex gap-2 mt-4">
      <input
        className="border p-2 flex-1"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-3 rounded">
        Add
      </button>
    </form>
  );
}

export default function GroupDetail() {
      
  const { id } = useParams();
  const [showAdd, setShowAdd] = useState(false);

  const expenses = useQuery({
    queryKey: ["group-expenses", id],
    queryFn: async () => (await api.get(`/expenses/group/${id}`)).data,
    enabled: !!id,
  });

  const members = useQuery({
    queryKey: ["group-members", id],
    queryFn: async () =>
      (await api.get(`/groups/${id}/members`)).data,
    enabled: !!id,
  });

  if (expenses.isLoading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 pb-24">
      <button
        onClick={() => window.history.back()}
        className="text-sm text-gray-600 mb-3 hover:underline"
      >
        ← Back to groups
      </button>

      <h1 className="font-bold text-lg mb-4">Group</h1>

      {(expenses.data || []).map((exp: any) => (
        <div key={exp.id} className="bg-white p-3 rounded shadow mb-2">
          <div className="font-medium">{exp.reason}</div>
          <div className="text-sm text-gray-500">
            status: {exp.status}
          </div>
        </div>
      ))}

      <h2 className="font-semibold mt-6 mb-2">Members</h2>

      {(members.data || []).map((m: any) => (
        <div
          key={m.id}
          className="flex justify-between border p-2 mb-1 rounded"
        >
          <span>{m.email}</span>

          <button
            className="text-red-500"
            onClick={async () => {
              await api.delete(`/groups/${id}/members/${m.id}`);
              members.refetch();
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {id && (
        <AddMember groupId={id} refetch={() => members.refetch()} />
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-full shadow"
      >
        + Expense
      </button>

      {showAdd && id && (
        <AddExpense groupId={id} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
