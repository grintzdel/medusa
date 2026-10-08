"use client"

import { THEME_STORAGE_KEY } from "@lib/theme"
import { Moon, Sun } from "@medusajs/icons"
import { useEffect, useState } from "react"

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const followSystem = (event: MediaQueryListEvent) => {
      let stored: string | null = null
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY)
      } catch {}
      if (stored) {
        return
      }
      document.documentElement.classList.toggle("dark", event.matches)
      setIsDark(event.matches)
    }

    media.addEventListener("change", followSystem)
    return () => media.removeEventListener("change", followSystem)
  }, [])

  const handleToggle = () => {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light")
    } catch {}
    setIsDark(next)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex h-9 w-9 items-center justify-center rounded-ctl text-ecaille-encre hover:bg-ecaille-tuile focus-visible:outline focus-visible:outline-2 focus-visible:outline-ecaille-lien"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      data-testid="theme-toggle"
    >
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}

export default ThemeToggle
