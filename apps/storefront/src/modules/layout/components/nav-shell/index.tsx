"use client"

import { clx } from "@medusajs/ui"
import { ReactNode, useEffect, useState } from "react"

type NavShellProps = {
  announcement: ReactNode
  children: ReactNode
}

const NavShell = ({ announcement, children }: NavShellProps) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="sticky inset-x-0 top-0 z-50" data-scrolled={isScrolled}>
      <div
        className={clx(
          "grid bg-ecaille-citron transition-[grid-template-rows] duration-300 ease-out",
          isScrolled ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        )}
      >
        <div className="overflow-hidden">{announcement}</div>
      </div>
      <header
        className={clx(
          "relative border-b transition-[height,background-color,box-shadow,border-color] duration-300 ease-out",
          isScrolled
            ? "h-14 border-ecaille-ligne/60 bg-ecaille-surface/80 shadow-[0_8px_24px_-12px_rgba(16,26,58,0.25)] backdrop-blur-md backdrop-saturate-150"
            : "h-16 border-ecaille-ligne bg-ecaille-surface"
        )}
      >
        {children}
      </header>
    </div>
  )
}

export default NavShell
