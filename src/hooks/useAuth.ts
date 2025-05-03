import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Optionnel : Vérifier la validité du token via une requête API
    async function verifyToken() {
      try {
        const response = await fetch('/api/v1/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }

    verifyToken();
  }, [router]);
}