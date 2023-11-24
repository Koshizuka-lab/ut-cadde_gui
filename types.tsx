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

export interface Package {
  name?: string
  title: string
  notes: string
  owner_org: string,
  caddec_provider_id: string,
  caddec_dataset_id_for_detail?: string,
  extras?: Array<{
    key: string,
    value: string
  }>
}

export interface Resource {
  package_id: string
  name: string
  description: string
  format: string
  url: string
}
