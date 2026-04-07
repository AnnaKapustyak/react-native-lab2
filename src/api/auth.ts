const API_URL = 'https://reqres.in/api';
const API_KEY = 'reqres_87623f9596ec4762a191000ae2befe2e';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface LoginResponse {
  token: string;
}

export async function loginRequest(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data: LoginResponse = await response.json();
  return data.token;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users?per_page=12`, {
    headers: { 'x-api-key': API_KEY },
  });
  const data = await response.json();
  return data.data;
}

export function findUserByEmail(users: User[], email: string): User | undefined {
  return users.find((u) => u.email === email);
}
