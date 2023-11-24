import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/pages/firebase';

/**
 * Redirects to /signin if the user is not logged in.
 * TODO: でも一瞬セキュアなページが見えちゃうから改善したい
 */
export function useRequireLogin() {
    const router = useRouter();

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/signin');
            }
        });
    }, [router]);
}