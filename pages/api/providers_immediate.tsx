import { fetchWithTimeout, fetchHttps } from './fetch'
import { NextApiRequest, NextApiResponse } from "next"

export default function providers_immediate(req: NextApiRequest, res: NextApiResponse) {

  const data = [
    {"name": "株式会社A", "cadde_id": "aaa", "distributions": [
      {
        "tag": "immed", 
        "title": "test1", 
        "resource_name": "test1.csv",
        "data_type": "csv", 
        "updated_time": "2023-04-01", 
        "url": "example.com"
      }, 
      {
        "tag": "immed", 
        "title": "test1", 
        "resource_name": "test1.json",
        "data_type": "json", 
        "updated_time": "2023-04-01", 
        "url": "example.com"
      }
    ]},
    {"name": "株式会社B", "cadde_id": "bbb", "distributions": [
      {
        "tag": "immed", 
        "title": "test2", 
        "resource_name": "test2.pdf",
        "data_type": "pdf", 
        "updated_time": "2023-04-01", 
        "url": "example.com"
      },
      {
        "tag": "immed", 
        "title": "test2", 
        "resource_name": "test2.csv",
        "data_type": "csv", 
        "updated_time": "2023-04-01", 
        "url": "example.com"
      }
    ]}
  ]

  const provider_id: string = req.headers.provider_id as string
  const token: string = req.headers.token as string
  const resource_url: string = req.headers.resource_url as string
  const resource_api_type: string = req.headers.resource_api_type as string

  fetchHttps('https://172.26.16.20:443/cadde/api/v4/file', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-cadde-resource-url': resource_url,
        'x-cadde-resource-api-type': resource_api_type,
        'x-cadde-provider': provider_id,
        'Authorization':'Bearer ' + token
    }
  })
  .then(res  => res.text())
  .then(data => {
    res.status(200).json(data)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({"error": "providers_immediate failed"})
  })
}
