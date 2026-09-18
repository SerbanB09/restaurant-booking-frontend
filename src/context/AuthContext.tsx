import { createContext, useContext, useState, type ReactNode } from 'react';
import * as customersApi from '../api/customers';
import type { Customer } from '../api/customers';

interface AuthContextValue {
    customer: Customer | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { first_name: string; last_name: string; email: string; phone?: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth() {
    const raw = localStorage.getItem('auth');
    if (!raw) return { token: null, customer: null };
    try {
        return JSON.parse(raw);
    } catch {
        return { token: null, customer: null };
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const stored = loadStoredAuth();
    const [token, setToken] = useState<string | null>(stored.token);
    const [customer, setCustomer] = useState<Customer | null>(stored.customer);

    function persist(token: string, customer: Customer) {
        localStorage.setItem('auth', JSON.stringify({ token, customer }));
        setToken(token);
        setCustomer(customer);
    }

    async function login(email: string, password: string) {
        const result = await customersApi.login({ email, password });
        persist(result.token, result.customer);
    }

    async function register(data: { first_name: string; last_name: string; email: string; phone?: string; password: string }) {
        const result = await customersApi.register(data);
        persist(result.token, result.customer);
    }

    function logout() {
        localStorage.removeItem('auth');
        setToken(null);
        setCustomer(null);
    }

    return (
        <AuthContext.Provider value={{ customer, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}