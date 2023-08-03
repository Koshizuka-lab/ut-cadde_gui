import { NextApiRequest, NextApiResponse } from 'next'
import { Catalog, Distribution } from '../../types'
import { fetchWithTimeout, fetchHttps } from './fetch'

function preprocess(json: Catalog, query: string): Array<Distribution> {
  let ret_data: Array<Distribution> = []
  let results = json["result"]["results"]
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i]["resources"].length; j++) {
      let tmp: Distribution = {
        title: '',
        provider_name: '',
        resource_name: '',
        data_type: '',
        updated_time: '',
        description: '',
        caddec_provider_id: '',
        caddec_dataset_id_for_detail: '',
        url: ''
      }
      tmp["title"] = results[i]["title"]
      tmp["provider_name"] = results[i]["organization"]["name"]
      tmp["resource_name"] = results[i]["resources"][j]["name"]
      tmp["data_type"] = results[i]["resources"][j]["format"]
      if (results[i]["resources"][j]["last_modified"] != null) {
        tmp["updated_time"] = results[i]["resources"][j]["last_modified"].slice(0, 10)
      } else {
        tmp["updated_time"] = results[i]["resources"][j]["created"].slice(0, 10)
      }
      tmp["description"] = results[i]["resources"][j]["description"]
      console.log(results[i]["extras"])
      tmp["caddec_provider_id"] = results[i]["extras"][1]["value"]
      tmp["caddec_dataset_id_for_detail"] = results[i]["extras"][0]["value"]
      tmp["url"] = results[i]["resources"][j]["url"]
      if (tmp["title"].indexOf(query) >= 0) {
        ret_data.push(tmp)
      }
    }
    
  }
  return ret_data
}

export default function metacatalog(req: NextApiRequest, res: NextApiResponse) {
  const query: string = req.query.q as string
  fetchHttps('https://172.26.16.20:443/cadde/api/v4/catalog?q=' + query, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-cadde-search': 'meta'
    }
  })
  .then(res  => res.json())
  .then(data => {
    console.log(data)
    const _data: Catalog = data as Catalog
    res.status(200).json(preprocess(_data, query))
  })
  .catch(error => {
    console.log(error)

    // データの取得に失敗したらデモデータを返す
    fetch("https://demo.ckan.org/api/3/action/package_search")
    .then(res => res.json())
    .then(data =>{
      console.log(data)
      res.status(200).json(preprocess(data, query))
    })
  })
}
