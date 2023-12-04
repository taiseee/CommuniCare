import { useAuthContext } from "@/provider/AuthProvider";
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

export function AuthGurad({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { user } = useAuthContext();

    if (typeof user === 'undefined') {
        return <p>Looding...</p>;
    }

    if (user === null && router.pathname !== '/signin' && router.pathname !== '/signup') {
        router.push('/signin');
        return null;
    }

    return <>{children}</>;
}
