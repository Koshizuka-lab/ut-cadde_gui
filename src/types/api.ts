export interface Options { 
  method: string
  headers: { // login
      'Content-Type': string 
  } | { // fetch metacatalog
      'Content-Type': string 
      'Cache-Control': string 
      'x-cadde-search': string 
  } | { // fetch deteilcatalog
      'Content-Type': string 
      'Cache-Control': string 
      'x-cadde-search': string 
      "x-cadde-provider": string 
      "Authorization": string 
  } | { // fetch resource
      'Content-Type': string 
      'Cache-Control': string 
      'x-cadde-resource-url': string 
      'x-cadde-resource-api-type': string 
      'x-cadde-provider': string 
      "Authorization": string 
  }
  body?: string
  agent?: any 
}


export interface LoginAuthResponse {
    access_token: string,
    refresh_token: string
  }