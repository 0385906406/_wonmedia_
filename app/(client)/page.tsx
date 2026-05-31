import { redirect } from 'next/navigation'

// The proxy handles locale detection and redirects,
// but this fallback ensures a clean redirect if reached directly.
export default function ClientRoot() {
  redirect('/vi')
}
