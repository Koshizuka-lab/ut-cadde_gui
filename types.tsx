import { Dispatch, SetStateAction } from "react";

export interface Distribution {
  title: string,
  providerName: string,
  resourceName: string,
  dataType: string,
  updatedTime: string,
  description: string,
  caddecProviderId: string,
  caddecDatasetIdForDetail: string,
  url: string
}

export interface Dataset {
  title: string,
  distributions: Array<Distribution>
}
  
export interface Catalog {
  result: {
    results: Array<{
      title: string,
      organization: {
        name: string
      },
      resources: Array<{
        name: string,
        format: string,
        last_modified: string,
        created: string,
        url: string
      }>
    }>
  }
}

export interface LoginAuthResponse {
  access_token: string,
  refresh_token: string
}

export interface User {
  token: string,
  userID: string
}
export interface UserContext {
  user: User,
  setUser: Dispatch<SetStateAction<User>>
}