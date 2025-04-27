'use client';

import { useRouter } from '@/i18n/navigation';

export default function Home() {
  const router = useRouter();

  router.push('/profile');
}
