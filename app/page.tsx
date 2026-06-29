"use client";
import { useState } from "react";

export default function Home() {
  const [id, setId] = useState<string | null>(null);
  const [size, setSize] = useState(128);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set("size", String(size));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    setBusy(false);
    setId(json.id ?? null);
  }

  return (
    <main style= fontFamily: "sans-serif", maxWidth: 480, margin: "40px auto" >
      <h1>SMap — загрузка картинки</h1>
      <form onSubmit={onSubmit}>
        <input type="file" name="image" accept="image/*" required />
        <div style= margin: "12px 0" >
          Размер: {size}px{" "}
          <input
            type="range"
            min={16}
            max={256}
            step={16}
            value={size}
            onChange={(e) => setSize(+e.target.value)}
          />
        </div>
        <button disabled={busy}>{busy ? "Загрузка…" : "Загрузить"}</button>
      </form>
      {id && (
        <p>
          Готово! В наковальне назови предмет: <b>smap:{id}</b>
        </p>
      )}
    </main>
  );
}
