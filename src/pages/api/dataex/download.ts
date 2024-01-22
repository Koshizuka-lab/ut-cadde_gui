import fetchHttps from '../fetchHttps'
import { NextApiRequest, NextApiResponse } from "next"

export default function download(req: NextApiRequest, res: NextApiResponse) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'x-cadde-resource-url': req.headers["x-cadde-resource-url"],
    'x-cadde-resource-api-type': req.headers["x-cadde-resource-api-type"],
    'x-cadde-provider': req.headers["x-cadde-provider"],
    'Authorization':req.headers["authorization"],
  }
  const url = req.headers["consumer-connector-origin"] + "/cadde/api/v4/file"
  fetchHttps(url, {
      method: 'GET', 
      headers: headers,
  })
  .then((res)  => {
    if (!res.ok) {
      throw res
    } else {
      return res.text()
    }
  })
  .then((data) => {
    console.log(data)
    res.status(200).send(data)
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({"error": "download failed"})
  })
}
