const API_URL = import.meta.env.VITE_API_URL;

export interface StaffUser {
    id: string;
    account_id: string;
    first_name: string;
    last_name: string;
    email: string;
    roles: string[];
}

export interface StaffAccount {
    id: string;
    name: string;
}

interface StaffAuthResponse {
    token: string;
    user: StaffUser;
}

interface RegisterAccountResponse {
    token: string;
    account: StaffAccount;
    user: StaffUser;
}

export async function staffLogin(email: string, password: string): Promise<StaffAuthResponse> {
    const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Invalid email or password');
    }

    return res.json();
}

export async function registerAccount(data: {
    restaurant_name: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}): Promise<RegisterAccountResponse> {
    const res = await fetch(`${API_URL}/accounts/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Something went wrong. Please try again.');
    }

    return res.json();
}