export default function providers_immediate(req, res) {

  const data = [
    {"name": "株式会社A", "cadde_id": "aaa", "distributions": [
      {
        "tag": "immed", 
        "name": "test1", 
        "data_type": "csv", 
        "updated_time": "2023/04/01", 
        "url": "example.com"
      }, 
      {
        "tag": "immed", 
        "name": "test2", 
        "data_type": "csv", 
        "updated_time": "2023/04/01", 
        "url": "example.com"
      }
    ]},
    {"name": "株式会社B", "cadde_id": "bbb", "distributions": [
      {
        "tag": "immed", 
        "name": "test3", 
        "data_type": "pdf", 
        "updated_time": "2023/04/01", 
        "url": "example.com"
      },
      {
        "tag": "immed", 
        "name": "test4", 
        "data_type": "pdf", 
        "updated_time": "2023/04/01", 
        "url": "example.com"
      }
    ]}
  ]

  res.status(200).json(data)
}
