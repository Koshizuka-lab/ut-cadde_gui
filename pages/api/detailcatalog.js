export const detaildata = [
  {"title": "test1", "extras:caddec_provider_id": 0, "extras:caddec_dataset_id_for_detail": 0, "resources:download_url": "test1.com", "resources:caddec_resource_type": 0},
  {"title": "test2", "extras:caddec_provider_id": 0, "extras:caddec_dataset_id_for_detail": 1, "resources:download_url": "test2.com", "resources:caddec_resource_type": 0},
  {"title": "test3", "extras:caddec_provider_id": 1, "extras:caddec_dataset_id_for_detail": 2, "resources:download_url": "test3.com", "resources:caddec_resource_type": 0},
  {"title": "test4", "extras:caddec_provider_id": 1, "extras:caddec_dataset_id_for_detail": 3, "resources:download_url": "test4.com", "resources:caddec_resource_type": 0},
  {"title": "test5", "extras:caddec_provider_id": 1, "extras:caddec_dataset_id_for_detail": 4, "resources:download_url": "test5.com", "resources:caddec_resource_type": 0},
]

export default function detailcatalog(req, res) {
  let pattern = req.query.q
  let ret_data = {}

  for (let i = 0; i < detaildata.length; i++) {
    if (detaildata[i]["extras:caddec_dataset_id_for_detail"] == Number(pattern)) {
      ret_data = detaildata[i]
    }
  }

  res.status(200).json(ret_data)
}
