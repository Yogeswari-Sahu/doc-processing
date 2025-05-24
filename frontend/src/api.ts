const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function uploadPDF(file: File) {
  const body = new FormData();
  body.append("file", file);
  const r = await fetch(`${API}/upload`, { method: "POST", body });
  if (!r.ok) throw new Error("Upload failed");
  return await r.json();
}

export async function updatePO(po: any) {
  const r = await fetch(`${API}/po/${po.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(po),
  });
  if (!r.ok) throw new Error("Save failed");
  return await r.json();
}

export function csvLink(poId: number) {
  return `${API}/po/${poId}/csv`;
}
