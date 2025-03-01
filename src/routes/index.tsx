import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/home/Hero'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <div><Hero/></div>
}
