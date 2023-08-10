import fetchHttps from './fetchHttps'
import { NextApiRequest, NextApiResponse } from "next"

export default function fetchResource(req: NextApiRequest, res: NextApiResponse) {

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
  .then((res: Response)  => {
    if (!res.ok) {
      throw new Error("error")
    } else {
      return res.text()
    }
  })
  .then((data: Blob) => {
    console.log(data)
    res.status(200).send(data)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({"error": "fetch_resource failed"})
  })
}
