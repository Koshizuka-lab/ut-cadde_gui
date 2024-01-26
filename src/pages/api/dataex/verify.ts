import { NextApiRequest, NextApiResponse } from "next";

import fetchHttps from "../fetchHttps";

export default function verify(req: NextApiRequest, res: NextApiResponse) {
  // 開発環境ならば、200を返す
  if (process.env.NODE_ENV === "development") {
    res.status(200).json({ result: "OK" });
    return;
  }

  const { verifierID, data, trust_seal_id } = req.body as {
    verifierID: string;
    data: string;
    trust_seal_id: string;
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: req.headers["authorization"],
  };
  const body = {
    verifierID: verifierID,
    data: data,
    trust_seal_id: trust_seal_id,
  };
  const url = process.env.TRUST_API_URL + "signatures/verify";
  fetchHttps(url, {
    method: "GET",
    headers: headers,
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      } else {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "verification failed" });
    });
}
