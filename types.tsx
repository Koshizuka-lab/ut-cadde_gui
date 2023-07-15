export interface Distribution {
  title: string,
  provider_name: string,
  resource_name: string,
  data_type: string,
  updated_time: string,
  url: string
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