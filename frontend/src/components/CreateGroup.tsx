import { useState } from "react";
import { api } from "../api/client";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateGroup({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const client = useQueryClient();

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);

    await api.post("/groups", { name });

    // refresh group list
    await client.invalidateQueries({ queryKey: ["groups"] });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-80">
        <h2 className="font-bold mb-3">Create Group</h2>

        <form onSubmit={submit} className="space-y-2">
          <input
            className="border w-full p-2 rounded"
            placeholder="Group name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white p-2 w-full rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-sm mt-2 w-full"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
