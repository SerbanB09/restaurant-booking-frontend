const API_URL = import.meta.env.VITE_API_URL;

export interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
}

interface AuthResponse {
    token: string;
    customer: Customer;
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || 'Something went wrong. Please try again.');
    }
    return res.json();
}

export async function register(data: { first_name: string; last_name: string; email: string; phone?: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return handleResponse(res);
}

export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return handleResponse(res);
}

export async function changePassword(token: string, data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/customers/me/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    return handleResponse(res);
}