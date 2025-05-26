import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the admin dashboard
    router.push('/admin-dashboard');
  }, []);

  return null;
} 