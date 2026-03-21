import MapsProvider from '@/components/MapsProvider'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <MapsProvider>
      {children}
    </MapsProvider>
  )
}
