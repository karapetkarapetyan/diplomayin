'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';
import { auth } from '@/firebase/config';

interface WithAuthProps {
  user: User | null;
}

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P & WithAuthProps>) {
  return (props: P) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
          router.push('/login');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return null;
    }

    return user ? <WrappedComponent {...props} user={user} /> : null;
  };
}

export default withAuth;
