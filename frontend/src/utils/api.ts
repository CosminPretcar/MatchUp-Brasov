export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://localhost:7093').replace(/\/+$/, '');

function getToken(): string | null {
  const savedUser = localStorage.getItem('user');
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser).token || null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'A apărut o eroare la comunicarea cu serverul.');
  }

  return data as T;
}
