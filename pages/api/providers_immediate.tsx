export default function providers_immediate(req, res) {

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

  res.status(200).json(data)
}
