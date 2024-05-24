import Cookies from "js-cookie";

import { LoginAuthResponse } from "@/types/api_external";

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
