import { NextApiRequest, NextApiResponse } from 'next'
import fetchHttps from '../../fetchHttps'

export default function detail(req: NextApiRequest, res: NextApiResponse) {
  const { q, fq } = req.query;
  let query: string;
  if (fq != null) {
    query = "fq=" + fq;
  } else if (q != null) {
    query = "q=" + q;
  } else {
    res.status(400).json({"error": "search failed"})
    return;
  }
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'x-cadde-search': 'detail',
    'x-cadde-dataspace': 'dataex',
    'x-cadde-provider': req.headers["x-cadde-provider"],
    'Authorization': req.headers["authorization"],
  }
  fetchHttps('https://172.26.16.20:443/cadde/api/v4/catalog?' + query, {
    method: 'GET',
    headers: headers,
  })
  .then((res)  => res.json())
  .then((data) => {
    res.status(200).json(data)
  })
  .catch(error => {
    console.log(error)
    res.status(error.status).json({"error": "search failed"})
  })
}
