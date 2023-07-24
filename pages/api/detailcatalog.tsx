import { fetchWithTimeout, fetchHttps } from "./fetch"
import { NextApiRequest, NextApiResponse } from "next"


export default function detailcatalog(req: NextApiRequest, res: NextApiResponse) {
  const query: string = req.query.q as string
  const provider_id: string = req.headers.provider_id as string
  const token: string = req.headers.token as string
  console.log("provider_id: " + provider_id)
  console.log("query: " + query)
  fetchHttps('https://172.26.16.20:443/cadde/api/v4/catalog?fq=caddec_dataset_id_for_detail:' + query, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-cadde-search': 'detail',
        "x-cadde-provider": provider_id,
        "Authorization": "Bearer " + token
    }
  })
  .then(res  => {
    return res.json()
  })
  .then(data => {
    console.log(data)
    res.status(200).json(data)
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({"error": "detailcatalog failed"})
  })
}
