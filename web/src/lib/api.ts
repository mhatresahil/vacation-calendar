const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export type Country = { code: string; name: string };

export const getCountries = () => api<Country[]>("/api/countries");

export const getMonth = (params: { country: string; year: number; month: number }) =>
  api(`/api/calendar/month?country=${params.country}&year=${params.year}&month=${params.month}`);

export const getQuarter = (params: { country: string; year: number; quarter: number }) =>
  api(`/api/calendar/quarter?country=${params.country}&year=${params.year}&quarter=${params.quarter}`);