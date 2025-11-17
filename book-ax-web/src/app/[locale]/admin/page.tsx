import { redirect } from 'next/navigation';

export default function AdminRedirect() {
  // Server-side redirect to locale-independent admin
  redirect('/admin');
}
