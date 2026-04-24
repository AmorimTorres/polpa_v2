import { AuthUser } from "@/types";

const USERS_KEY = "polpa_users";
const SESSION_KEY = "polpa_session";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function hashPassword(password: string): Promise<string> {
    const encoded = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function loadUsers(): AuthUser[] {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function saveUsers(users: AuthUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Returns the currently logged-in user, or null. */
export function getCurrentUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null;
    }
}

/** Persists current user session (call after points update). */
export function saveCurrentUser(user: AuthUser): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Clears session — does NOT delete the user from the registry. */
export function logoutUser(): void {
    localStorage.removeItem(SESSION_KEY);
}

/**
 * Registers a new user.
 * @returns The created AuthUser, or an error string.
 */
export async function registerUser(
    username: string,
    password: string
): Promise<AuthUser | string> {
    const users = loadUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        return "Usuário já existe.";
    }
    const passwordHash = await hashPassword(password);
    const newUser: AuthUser = { username, passwordHash, points: 0 };
    saveUsers([...users, newUser]);
    saveCurrentUser(newUser);
    return newUser;
}

/**
 * Logs in an existing user.
 * @returns The AuthUser on success, or an error string.
 */
export async function loginUser(
    username: string,
    password: string
): Promise<AuthUser | string> {
    const users = loadUsers();
    const user = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (!user) return "Usuário não encontrado.";
    const hash = await hashPassword(password);
    if (hash !== user.passwordHash) return "Senha incorreta.";
    saveCurrentUser(user);
    return user;
}
