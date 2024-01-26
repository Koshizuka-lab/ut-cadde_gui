import Cookies from "js-cookie";
import { useCallback, useState } from "react";

import { LoginAuthResponse } from "@/types/api";

export interface FetchOptions extends RequestInit {
  headers: {
    Authorization?: string;
    "x-cadde-provider"?: string;
    "x-cadde-resource-url"?: string;
    "x-cadde-resource-api-type"?: string;
    "consumer-connector-origin"?: string;
  };
}

async function refreshToken() {
  const response = await fetch("/api/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: Cookies.get("refresh_token"),
    }),
  });
  const data: LoginAuthResponse = (await response.json()) as LoginAuthResponse;
  Cookies.set("access_token", data.access_token);
  Cookies.set("refresh_token", data.refresh_token);
}

export const fetchWithRefresh = async (url: string, options: FetchOptions) => {
  let response = await fetch(url, options);
  // アクセストークンの期限切れを検知
  if (response.status === 401) {
    await refreshToken(); // トークンをリフレッシュ
    if (options.headers.Authorization != null) {
      options.headers.Authorization = Cookies.get("access_token")!;
    }
    response = await fetch(url, options); // リクエストを再試行
  }
  return response;
};

export function useFetch<T>(
  url: string,
  options: FetchOptions,
): {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fetchData: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchWithRefresh(url, options);

      const responseData = (await response.json()) as T;
      console.log("--- useFetch ---");
      console.log("url", url);
      console.log("options", options);
      console.log("responseData", responseData);
      console.log("----------------");
      setData(responseData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { data, error, loading, fetchData };
}
