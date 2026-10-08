import { clx } from "@medusajs/ui"

const TONES = ["outremer", "citron", "piment", "algue", "sardine"] as const

export type TinTone = (typeof TONES)[number]

const isTinTone = (value: unknown): value is TinTone =>
  TONES.some((tone) => tone === value)

export const tinToneFor = (key: string, preferred?: unknown): TinTone => {
  if (isTinTone(preferred)) {
    return preferred
  }

  let hash = 0
  for (const char of key) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return TONES[hash % TONES.length]
}

type TinProps = {
  label: string
  sublabel?: string
  tone?: unknown
  className?: string
}

const Tin = ({ label, sublabel, tone, className }: TinProps) => {
  return (
    <div className={clx("ec-tin-frame", className)} aria-hidden="true">
      <div className="ec-tin" data-tone={tinToneFor(label, tone)}>
        <div className="ec-tin-band text-[clamp(5px,7cqw,15px)]">
          <span className="line-clamp-2">{label}</span>
          {sublabel && (
            <small className="mt-1 block font-mono text-[0.6em] font-medium normal-case tracking-[0.08em]">
              {sublabel}
            </small>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tin
