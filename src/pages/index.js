import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '../constants';
import { useSession } from '../hooks/session';

/**
 * Component for the entire app.
 *
 * @returns {null} Nothing.
 */
export default function IndexPage() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.replace(ROUTES.SIGN_IN);
    } else {
      router.replace(ROUTES.PULL_REQUESTS);
    }
  }, [session, router]);

  return null;
}
