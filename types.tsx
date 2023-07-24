export interface Distribution {
  title: string,
  provider_name: string,
  resource_name: string,
  data_type: string,
  updated_time: string,
  description: string,
  caddec_provider_id: string,
  caddec_dataset_id_for_detail: string,
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