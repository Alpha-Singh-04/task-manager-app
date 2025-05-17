import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login'); // replaces history to prevent back navigation
  }, []);

  return null; // or a loading spinner if you want
}
