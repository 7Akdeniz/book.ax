import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import PageEditor from '@/components/cms/PageEditor';

export default async function NewPagePage() {
  // Verify admin access
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  const decoded = verifyAccessToken(token);
  if (!decoded || decoded.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageEditor />
    </div>
  );
}
