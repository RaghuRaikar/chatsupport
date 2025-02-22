import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      router.push('/landingpage');
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
