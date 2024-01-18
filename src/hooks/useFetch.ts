import { useState } from 'react';
import Cookies from 'js-cookie';

export interface FetchOptions extends RequestInit {
  headers: {
    'Content-Type': string,
    'Cache-Control': string,
    'x-cadde-search': string,
    'x-cadde-provider'?: string,
    'x-cadde-dataspace'?: string,
    'x-cadde-resource-url'?: string,
    'x-cadde-resource-api-type'?: string,
    'Authorization'?: string,
  }
}

async function refreshToken() {
  const response = await fetch("/api/refresh", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "refresh_token": Cookies.get("refresh_token"),
    })
  });
  const data = await response.json();
  Cookies.set("access_token", data.access_token);
  Cookies.set("refresh_token", data.refresh_token);
}

export function useFetch<T>(url: string, options: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      let response = await fetch(url, options);

      // アクセストークンの期限切れを検知
      if (response.status === 401) {
        await refreshToken(); // トークンをリフレッシュ
        if (options.headers.Authorization != null) {
          options.headers.Authorization = Cookies.get("access_token")!;
        }
        response = await fetch(url, options); // リクエストを再試行
      }

      if (!response.ok) throw new Error('Network response was not ok');

      const responseData = await response.json() as T;
      setData(responseData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
}