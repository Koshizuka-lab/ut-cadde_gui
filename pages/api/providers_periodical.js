export default function providers_periodical(req, res) {

  const data = [
    {"name": "株式会社C", "cadde_id": "ccc", "distributions": [
      {
        "tag": "period", 
        "name": "test5", 
        "data_type": "csv",
        "transfer_url": "googledrive.com", 
        "often": "Y/M/01 12:00"
      },
      {
        "tag": "period", 
        "name": "test6", 
        "data_type": "csv",
        "transfer_url": "googledrive.com", 
        "often": " Y/M/01 12:00"
      },
      ]
    },
    {"name": "株式会社D", "cadde_id": "ddd", "distributions": [
      {
        "tag": "period",
        "name": "test7",
        "data_type": "csv",
        "transfer_url": "aws.com",
        "often": "Y/M/15 10:00"
      },
      {
        "tag": "period",
        "name": "test8",
        "data_type": "csv",
        "transfer_url": "aws.com",
        "often": "Y/M/15 10:00"
      },
      ]
    }
  ]

  res.status(200).json(data)
}
