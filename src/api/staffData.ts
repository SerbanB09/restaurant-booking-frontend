const API_URL = import.meta.env.VITE_API_URL;

export interface StaffVenue {
    id: string;
    name: string;
    address: string;
}

export interface StaffArea {
    id: string;
    venue_id: string;
    name: string;
    width: number;
    height: number;
}

export interface StaffTableType {
    id: string;
    name: string;
    width: number;
    height: number;
}

export interface StaffTable {
    id: string;
    area_id: string;
    table_type_id: string;
    name: string;
    seat_count: number;
    position_x: number;
    position_y: number;
}

export interface FloorPlanBooking {
    id: string;
    person_count: number;
    date: string;
    guest_name: string | null;
    guest_phone: string | null;
    note: string | null;
}

export interface FloorPlanTable {
    id: string;
    name: string;
    seat_count: number;
    position_x: number;
    position_y: number;
    booking: FloorPlanBooking | null;
}

export interface FloorPlan {
    area: { id: string; name: string; width: number; height: number };
    tables: FloorPlanTable[];
}

function authHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
}

function jsonHeaders(token: string) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || body?.error || 'Something went wrong.');
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

export async function listStaffVenues(token: string): Promise<StaffVenue[]> {
    const res = await fetch(`${API_URL}/venues`, { headers: authHeaders(token) });
    return handle(res);
}

export async function createVenue(data: { name: string; address: string }, token: string): Promise<StaffVenue> {
    const res = await fetch(`${API_URL}/venues`, { method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data) });
    return handle(res);
}

export async function deleteVenue(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/venues/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return handle(res);
}

export async function listStaffAreas(token: string): Promise<StaffArea[]> {
    const res = await fetch(`${API_URL}/areas`, { headers: authHeaders(token) });
    return handle(res);
}

export async function createArea(data: { venue_id: string; name: string; width: number; height: number }, token: string): Promise<StaffArea> {
    const res = await fetch(`${API_URL}/areas`, { method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data) });
    return handle(res);
}

export async function deleteArea(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/areas/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return handle(res);
}

export async function listTableTypes(token: string): Promise<StaffTableType[]> {
    const res = await fetch(`${API_URL}/table_types`, { headers: authHeaders(token) });
    return handle(res);
}

export async function createTableType(data: { name: string; width: number; height: number }, token: string): Promise<StaffTableType> {
    const res = await fetch(`${API_URL}/table_types`, { method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data) });
    return handle(res);
}

export async function deleteTableType(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/table_types/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return handle(res);
}

export async function listTables(token: string): Promise<StaffTable[]> {
    const res = await fetch(`${API_URL}/tables`, { headers: authHeaders(token) });
    return handle(res);
}

export async function createTable(data: {
    area_id: string; table_type_id: string; name: string; seat_count: number; position_x: number; position_y: number;
}, token: string): Promise<StaffTable> {
    const res = await fetch(`${API_URL}/tables`, { method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data) });
    return handle(res);
}

export async function deleteTable(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/tables/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return handle(res);
}

export async function getFloorPlan(areaId: string, date: string, token: string): Promise<FloorPlan> {
    const res = await fetch(`${API_URL}/areas/${areaId}/floor-plan?date=${encodeURIComponent(date)}`, { headers: authHeaders(token) });
    return handle(res);
}

export interface StaffAccountUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    roles: string[];
    is_owner: boolean;
}

export async function listStaffUsers(token: string): Promise<StaffAccountUser[]> {
    const res = await fetch(`${API_URL}/users`, { headers: authHeaders(token) });
    return handle(res);
}

export async function createStaffUser(data: { first_name: string; last_name: string; email: string; password: string; roles: string[] }, token: string): Promise<StaffAccountUser> {
    const res = await fetch(`${API_URL}/users`, { method: 'POST', headers: jsonHeaders(token), body: JSON.stringify(data) });
    return handle(res);
}

export async function deleteStaffUser(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: authHeaders(token) });
    return handle(res);
}