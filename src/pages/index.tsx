import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '../constants';
import { useSession } from '../hooks/session';

/**
 * Component for the entire app.
 *
 * @returns Nothing.
 */
export default function IndexPage() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.type === 'signedIn') {
      router.replace(ROUTES.PULL_REQUESTS);
    } else {
      router.replace(ROUTES.SIGN_IN);
    }
  }, [session, router]);

  return null;
}
