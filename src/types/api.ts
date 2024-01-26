import * as https from "https";

import { Catalog } from "./ckan";

export interface Options {
  method: string;
  headers:
    | {
        // login
        "Content-Type": string;
      }
    | {
        // fetch metacatalog
        "Content-Type": string;
        "Cache-Control": string;
        "x-cadde-search": string;
        "consumer-connector-url": string;
      }
    | {
        // fetch deteilcatalog
        "Content-Type": string;
        "Cache-Control": string;
        "x-cadde-search": string;
        "x-cadde-provider": string;
        Authorization: string;
        "consumer-connector-url": string;
      }
    | {
        // fetch resource
        "Content-Type": string;
        "Cache-Control": string;
        "x-cadde-resource-url": string;
        "x-cadde-resource-api-type": string;
        "x-cadde-provider": string;
        Authorization: string;
        "consumer-connector-url": string;
      };
  body?: string;
  agent?: https.Agent;
}

export interface LoginAuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface SearchResponse {
  help: string;
  success: boolean;
  result: Catalog;
}
