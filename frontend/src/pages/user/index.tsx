import { useRouter } from "next/router";
import { useEffect } from 'react';

// このページは使わないので，リダイレクト
export default function User() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, []);

    return;
};