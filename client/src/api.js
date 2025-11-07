const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function post(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function put(path, body) {
  const res = await fetch(API + path, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function get(path) {
  const res = await fetch(API + path, { credentials: 'include' });
  return res.json();
}

export const endpoints = {
  googleStart: () => `${API}/auth/google`,
};
