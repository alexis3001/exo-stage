// app/historique/page.js
import Historique from '@/components/historique'

export default function HistoriquePage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historique de vos restaurants</h1>
      <Historique />
    </main>
  )
}
