import { useAuthContext } from '@/provider/AuthProvider';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { Spinner, Stack } from '@chakra-ui/react';

export function AuthGurad({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { user } = useAuthContext();

    if (typeof user === 'undefined') {
        return (
            <>
                <Stack align="center" justify="center" h="100vh">
                    <Spinner size="xl" />
                </Stack>
            </>
        );
    }

    // ログインしていない場合はログイン画面にリダイレクト
    if (
        user === null &&
        router.pathname !== '/' &&
        router.pathname !== `/[eventId]` &&
        router.pathname !== '/user/[userId]' &&
        router.pathname !== '/signin' &&
        router.pathname !== '/signup'
    ) {
        router.replace('/signin');
        return null;
    }

    // ログインしている場合はホーム画面にリダイレクト
    if (
        user !== null &&
        (router.pathname === '/signin' || router.pathname === '/signup')
    ) {
        router.replace('/');
        return null;
    }

    return <>{children}</>;
}
