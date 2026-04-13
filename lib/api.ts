export async function apiFetch<T = any>(
  input: string,
  init?: RequestInit
): Promise<T> {
  console.log("apiFetch called:", input, init?.method);

  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json();
  console.log("apiFetch response:", input, res.status, data);

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}