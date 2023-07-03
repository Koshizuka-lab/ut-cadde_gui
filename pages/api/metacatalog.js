export const metadata = [
  {'title': 'test1', 'extras:caddec_provider_id': 0, 'extras:caddec_dataset_id_for_detail': 0, "provider_name": "株式会社A", "updated_time": "2023/04/01", "data_type": "csv"},
  {'title': 'test2', 'extras:caddec_provider_id': 0, 'extras:caddec_dataset_id_for_detail': 1, "provider_name": "株式会社B", "updated_time": "2023/04/01", "data_type": "csv"},
  {'title': 'test3', 'extras:caddec_provider_id': 1, 'extras:caddec_dataset_id_for_detail': 2, "provider_name": "株式会社C", "updated_time": "2023/04/01", "data_type": "csv"},
  {'title': 'test4', 'extras:caddec_provider_id': 1, 'extras:caddec_dataset_id_for_detail': 3, "provider_name": "株式会社D", "updated_time": "2023/04/01", "data_type": "csv"},
  {'title': 'test5', 'extras:caddec_provider_id': 1, 'extras:caddec_dataset_id_for_detail': 4, "provider_name": "株式会社D", "updated_time": "2023/04/01", "data_type": "csv"},
]

export default function metacatalog(req, res) {
  let pattern = req.query.q
  let ret_data = []

  for (let i = 0; i < metadata.length; i++) {
    if (metadata[i]['title'].indexOf(pattern) > -1) {
      ret_data.push(metadata[i])
    }
  }

  res.status(200).json(ret_data)
}
