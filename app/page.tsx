"use client";
import { useState } from "react";

const mainStyle = {
  fontFamily: "sans-serif",
  maxWidth: 480,
  margin: "40px auto",
} as const;

const rowStyle = { margin: "12px 0" } as const;
const errStyle = { color: "red" } as const;

export default function Home() {
  const [id, setId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [size, setSize] = useState(128);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setId(null);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("size", String(size));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.id) {
        setErr(json.error ?? "HTTP " + res.status);
      } else {
        setId(json.id);
      }
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={mainStyle}>
      <h1>SMap — загрузка картинки</h1>
      <form onSubmit={onSubmit}>
        <input type="file" name="image" accept="image/*" required />
        <div style={rowStyle}>
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
      {err && <p style={errStyle}>Ошибка: {err}</p>}
    </main>
  );
}
