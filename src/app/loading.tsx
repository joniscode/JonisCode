import BrandLoader from '@/components/BrandLoader'

export default function Loading() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#040914] px-4 text-white">
      <BrandLoader label="Cargando" size={132} />
    </main>
  )
}
