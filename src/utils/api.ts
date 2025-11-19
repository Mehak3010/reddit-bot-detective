const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function uploadDataset(datasetName: string, file: File) {
  const form = new FormData();
  form.append("datasetName", datasetName);
  form.append("file", file);
  const res = await fetch(`${API_BASE}/upload-dataset`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export async function markVerifiedAccounts(usernames: string[]) {
  const res = await fetch(`${API_BASE}/verified-accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames }),
  });
  if (!res.ok) throw new Error(`Mark verified failed: ${res.status}`);
  return res.json();
}

export async function getUsers(dataset?: string) {
  const url = dataset ? `${API_BASE}/users?dataset=${encodeURIComponent(dataset)}` : `${API_BASE}/users`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch users failed: ${res.status}`);
  return res.json();
}

export async function getDatasets() {
  const res = await fetch(`${API_BASE}/datasets`);
  if (!res.ok) throw new Error(`Fetch datasets failed: ${res.status}`);
  return res.json();
}