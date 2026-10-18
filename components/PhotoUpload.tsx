"use client";
import { useState } from "react";

// Posts the file to /api/upload (server puts it in S3) and stores the URL in a hidden "photoUrl" input.
export default function PhotoUpload() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading"); setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "players");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url); setStatus("idle");
    } catch (err) {
      setStatus("error"); setMsg((err as Error).message);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {url ? <img src={url} alt="" className="h-14 w-14 rounded-full object-cover" /> :
        <div className="h-14 w-14 rounded-full bg-slate-200" />}
      <div className="text-sm">
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} />
        {status === "uploading" && <p className="text-slate-500">Uploading…</p>}
        {status === "error" && <p className="text-red-600">{msg}</p>}
      </div>
      <input type="hidden" name="photoUrl" value={url} />
    </div>
  );
}