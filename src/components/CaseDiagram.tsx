import type { Language } from './LanguageProvider'
import { DIAGRAMS } from '@/data/site'
import type { CaseDiagram as CaseDiagramKind } from '@/data/site'

type Labels = (typeof DIAGRAMS)['es']

function Box({
  x,
  y,
  w,
  h = 46,
  label,
  accent = false,
}: {
  x: number
  y: number
  w: number
  h?: number
  label: string
  accent?: boolean
}) {
  return (
    <g className={accent ? 'text-accent' : undefined}>
      <rect className="dg-line" pathLength={1} x={x} y={y} width={w} height={h} rx={8} />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={13}
       
      >
        {label}
      </text>
    </g>
  )
}

function Wire({ path }: { path: string }) {
  return <path className="dg-line" pathLength={1} d={path} />
}

function Note({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="currentColor" fontSize={11} opacity={0.7}>
      {label}
    </text>
  )
}

function Microfrontends({ t }: { t: Labels }) {
  return (
    <>
      <Box x={190} y={16} w={140} label={t.shell} accent />
      <Wire path="M260 62 V100 H95 V138" />
      <Wire path="M260 62 V138" />
      <Wire path="M260 62 V100 H425 V138" />
      <Box x={15} y={138} w={160} label={t.selfAdmission} />
      <Box x={180} y={138} w={160} label={t.scheduling} />
      <Box x={345} y={138} w={160} label={t.sharedUi} />
      <Wire path="M95 184 V230 H165 V276" />
      <Wire path="M260 184 V230 H165" />
      <Wire path="M260 230 H355 V276" />
      <Box x={85} y={276} w={160} label="REST" />
      <Box x={275} y={276} w={160} label="GraphQL" />
    </>
  )
}

function Migration({ t }: { t: Labels }) {
  return (
    <>
      <Box x={15} y={30} w={170} label={t.previous} />
      <Wire path="M185 53 H335" />
      <Wire path="M325 46 L335 53 L325 60" />
      <Note x={260} y={42} label={t.migration} />
      <Box x={335} y={30} w={170} label="Next.js" accent />
      <Wire path="M420 76 V130" />
      <Box x={335} y={130} w={170} label={t.auth} />
      <Box x={15} y={270} w={140} label="git push" />
      <Wire path="M155 293 H190" />
      <Box x={190} y={270} w={150} label="GitHub Actions" />
      <Wire path="M340 293 H375" />
      <Box x={375} y={270} w={130} label="Vercel" />
      <Wire path="M440 270 V176" />
      <Note x={474} y={228} label={t.deploy} />
    </>
  )
}

function Portal({ t }: { t: Labels }) {
  return (
    <>
      <rect className="dg-line" pathLength={1} x={15} y={16} width={490} height={316} rx={14} />
      <text className="text-accent" x={38} y={48} fill="currentColor" fontSize={13}>
        {t.portal}
      </text>
      <Box x={45} y={84} w={200} label={t.angularModule} />
      <Box x={275} y={84} w={200} label={t.reactModule} />
      <Wire path="M145 130 V178 H260 V214" />
      <Wire path="M375 130 V178 H260" />
      <Box
        x={45}
        y={214}
        w={430}
        h={72}
        label={t.shared}
       
      />
    </>
  )
}

export default function CaseDiagram({ kind, language }: { kind: CaseDiagramKind; language: Language }) {
  const t = DIAGRAMS[language]

  return (
    <svg viewBox="0 0 520 348" aria-hidden className="h-auto w-full font-mono text-ink/75">
      {kind === 'microfrontends' ? <Microfrontends t={t} /> : null}
      {kind === 'migration' ? <Migration t={t} /> : null}
      {kind === 'portal' ? <Portal t={t} /> : null}
    </svg>
  )
}
