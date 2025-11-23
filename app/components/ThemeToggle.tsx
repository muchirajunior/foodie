'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    const initial = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : prefersDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="rounded-lg bg-orange-800 hover:bg-orange-900 text-white px-3 py-2"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

