import {
    createContext,
    ReactNode,
    useState,
    useContext,
    useEffect
} from 'react';
import type { User } from '@firebase/auth';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '@/lib/firebaseConfig';

export type GlobalAuthState = {
    user: User | null | undefined; // 認証済み | 未認証 | 認証中
};

const initialState: GlobalAuthState = {
    user: undefined
};

const AuthContext = createContext<GlobalAuthState>(initialState);

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<GlobalAuthState>(initialState);

    useEffect(() => {
        try {
            return onAuthStateChanged(auth, (user) => {
                setUser({ user });
            });
        } catch (error) {
            setUser(initialState);
            throw error;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
