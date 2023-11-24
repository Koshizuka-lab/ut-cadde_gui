import type { Package, Resource } from "../types"

export class CKAN {
    url: string
    constructor (url: string) {
      this.url = url
    }
  
    async action (action: string, body: Package | Resource | {}, callback: (err: any, data: any) => void) {
      const apiUrl = this.url + "/api/3/action/" + action
      fetch("/api/ckan?url=" + apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
      .then((res: Response) => res.json())
      .then((data: any) => {
        console.log(action, data)
        callback(null, data)
      })
      .catch((err: any) => {
        console.log(action, err)
        callback(err, null)
      })
    }
  
    async searchPackage (query: string, callback: (err: any, data: any) => void) {
      return await this.action("package_search", {"q": query}, callback)
    }
  
    async createPackage (body: Package, callback: (err: any, data: any) => void) {
      return await this.action("package_create", body, callback)
    }
  
    async createResource (body: Resource, callback: (err: any, data: any) => void) {
      await this.action("resource_create", body, callback)
    }
  }