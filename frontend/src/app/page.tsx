import { Suspense } from 'react'
import LandingPage from '@/pages/LandingPage'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage />
    </Suspense>
  )
}
