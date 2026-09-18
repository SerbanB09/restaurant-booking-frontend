import { createContext, useContext, useState, type ReactNode } from 'react';
import { staffLogin, registerAccount, type StaffUser } from '../api/staff';

interface StaffAuthContextValue {
    staffUser: StaffUser | null;
    staffToken: string | null;
    staffLoginAction: (email: string, password: string) => Promise<void>;
    staffRegisterAction: (data: { restaurant_name: string; first_name: string; last_name: string; email: string; password: string }) => Promise<void>;
    staffLogout: () => void;
}

const StaffAuthContext = createContext<StaffAuthContextValue | null>(null);

function loadStoredStaffAuth() {
    const raw = localStorage.getItem('staffAuth');
    if (!raw) return { token: null, user: null };
    try {
        return JSON.parse(raw);
    } catch {
        return { token: null, user: null };
    }
}

export function StaffAuthProvider({ children }: { children: ReactNode }) {
    const stored = loadStoredStaffAuth();
    const [staffToken, setStaffToken] = useState<string | null>(stored.token);
    const [staffUser, setStaffUser] = useState<StaffUser | null>(stored.user);

    function persist(token: string, user: StaffUser) {
        localStorage.setItem('staffAuth', JSON.stringify({ token, user }));
        setStaffToken(token);
        setStaffUser(user);
    }

    async function staffLoginAction(email: string, password: string) {
        const result = await staffLogin(email, password);
        persist(result.token, result.user);
    }

    async function staffRegisterAction(data: { restaurant_name: string; first_name: string; last_name: string; email: string; password: string }) {
        const result = await registerAccount(data);
        persist(result.token, result.user);
    }

    function staffLogout() {
        localStorage.removeItem('staffAuth');
        setStaffToken(null);
        setStaffUser(null);
    }

    return (
        <StaffAuthContext.Provider value={{ staffUser, staffToken, staffLoginAction, staffRegisterAction, staffLogout }}>
            {children}
        </StaffAuthContext.Provider>
    );
}

export function useStaffAuth() {
    const ctx = useContext(StaffAuthContext);
    if (!ctx) throw new Error('useStaffAuth must be used within StaffAuthProvider');
    return ctx;
}