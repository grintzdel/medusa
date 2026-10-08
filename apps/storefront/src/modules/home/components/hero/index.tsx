import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Tin from "@modules/common/components/tin"

const Hero = () => {
  return (
    <section className="w-full bg-ecaille-outremer text-white dark:bg-[#1B2F86]">
      <div className="content-container grid items-center gap-12 py-16 small:grid-cols-[1.2fr_1fr] small:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="ec-eyebrow text-[#D7DEFA]">
            Millésime 2024 · 3 200 boîtes numérotées
          </span>
          <h1 className="ec-display text-[clamp(3.5rem,9vw,7.5rem)]">
            La sardine <em className="not-italic text-ecaille-citron">se bonifie</em> avec le temps
          </h1>
          <p className="max-w-[40ch] text-lg leading-relaxed text-[#D7DEFA]">
            Pêchées en mai au large de Belle-Île, mises en boîte le lendemain à Quiberon. À ouvrir dans deux ans, ou ce soir.
          </p>
          <LocalizedClientLink
            href="/store"
            className="rounded-ctl bg-ecaille-citron px-6 py-3 font-semibold text-ecaille-nuit transition-colors hover:bg-[#E9C52A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ecaille-citron"
          >
            Découvrir le millésime
          </LocalizedClientLink>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4" aria-hidden="true">
          <Tin label="Sardines" sublabel="Millésime 2024" tone="piment" className="w-[44%] drop-shadow-xl" />
          <Tin label="Maquereau" sublabel="Citron confit" tone="citron" className="w-[44%] translate-y-4 rotate-6 drop-shadow-xl" />
          <Tin label="Anchois" sublabel="Collioure" tone="sardine" className="w-[44%] drop-shadow-xl" />
        </div>
      </div>
    </section>
  )
}

export default Hero
