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

    if (
        user === null &&
        router.pathname !== '/' &&
        router.pathname !== '/signin' &&
        router.pathname !== '/signup'
    ) {
        router.push('/signin');
        return null;
    }

    return <>{children}</>;
}
