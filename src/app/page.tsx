import { redirect } from 'next/navigation';

// The middleware handles locale routing; this is a fallback
export default function RootPage() {
  redirect('/en');
}
