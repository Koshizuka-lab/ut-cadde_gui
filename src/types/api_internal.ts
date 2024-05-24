// フロントエンドからバックエンドのAPIを呼び出すための型定義

import { Catalog } from "@/types/ckan";

export interface LoginResponse {
  redirectUri: string;
}

export interface AuthCodeResponse {
  access_token: string;
  refresh_token: string;
}

export interface LogoutResponse {
  redirectUri: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface SearchResponse {
  help: string;
  success: boolean;
  result: Catalog;
}

export interface ProvenanceResponse {
  message: string;
}

export interface Consumer {
  name: string;
  connectorUrl: string;
  dashboardUrl: string;
}

export interface ConsumersResponse {
  consumers: Consumer[];
}

export interface ProvidersResponse {
  options: {
    value: string;
    label: string;
  }[];
}

export interface ErrorResponse {
  message: string;
}