import { NextApiRequest, NextApiResponse } from 'next'
import { Catalog, Dataset, Distribution } from '../../types'
import fetchHttps from './fetchHttps'

function catalogToDatasets(json: Catalog): Array<Dataset> {
  let retData: Array<Dataset> = []
  let results = json["result"]["results"]
  for (let result of results) {
    let distibutionList: Array<Distribution> = []
  
    let datasetTitle = result["title"]
    let providerName = result["organization"]["name"]
    let caddecProviderId = result["extras"][1]["value"]
    let caddecDatasetIdForDetail = result["extras"][0]["value"]

    for (let resource of result["resources"]) {
      let distribution: Distribution = {
        title: datasetTitle,
        providerName: providerName,
        resourceName: resource["name"],
        dataType: resource["format"],
        updatedTime: (resource["last_modified"] != null) ? resource["last_modified"].slice(0, 10) : resource["created"].slice(0, 10),
        description: resource["description"],
        caddecProviderId: caddecProviderId,
        caddecDatasetIdForDetail: caddecDatasetIdForDetail,
        url: resource["url"]
      }
      distibutionList.push(distribution)
    }
    let dataset: Dataset = {
      title: datasetTitle,
      distributions: distibutionList
    }
    retData.push(dataset)
  }
  return retData
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
  .then((res)  => res.json())
  .then((data: Catalog) => {
    res.status(200).json(catalogToDatasets(data))
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({"error": "metacatalog failed"})
  })
}
