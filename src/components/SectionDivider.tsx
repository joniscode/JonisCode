// src/components/SectionDivider.tsx
export default function SectionDivider({
  duration = 5000,
  delay = 0,
  edge = '10%' // cuánta zona se desvanece en los extremos
}: { duration?: number; delay?: number; edge?: string }) {
  return (
    <div className="relative my-8 overflow-hidden">
      {/* línea base: se adapta a claro/oscuro */}
      <div className="h-px bg-gradient-to-r from-transparent via-black/15 to-transparent dark:via-white/15" />

      {/* capa del haz con máscara en bordes */}
      <div className="pointer-events-none absolute inset-0 mask-edge-fade" style={{ ['--edge' as any]: edge }}>
        {/* haz nítido */}
        <div
          className="animate-beam absolute top-1/2 -translate-y-1/2
                     h-[2px] w-28
                     bg-gradient-to-r from-transparent via-black to-transparent dark:via-white"
          style={{ animationDuration: `${duration}ms`, animationDelay: `${delay}ms` }}
        />
        {/* brillo suave */}
        <div
          className="animate-beam absolute top-1/2 -translate-y-1/2
                     h-[2px] w-28
                     bg-gradient-to-r from-transparent via-black/70 to-transparent dark:via-white/70
                     blur-[6px]"
          style={{ animationDuration: `${duration}ms`, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
