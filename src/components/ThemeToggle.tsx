// src/components/ThemeToggle.tsx
'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle(){
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  // leer preferencia
  useEffect(() => {
    const ls = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = ls ? ls === 'dark' : prefersDark;
    setDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if(!mounted) return null;
  return (
    <button
      onClick={toggle}
      className="fixed right-4 top-4 z-50 rounded-full border px-3 py-2 text-sm backdrop-blur
                 bg-white/70 dark:bg-black/40 border-black/20 dark:border-white/20"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {dark ? '☀️ Clear' : '🌙 Dark'}
    </button>
  );
}
