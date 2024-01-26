import { NextApiRequest, NextApiResponse } from "next";

import fetchHttps from "../../fetchHttps";

export default function detail(req: NextApiRequest, res: NextApiResponse) {
  const { q, fq } = req.query as { q: string; fq: string };
  let query: string;
  if (fq != null) {
    query = "rows=100&fq=" + fq;
  } else if (q != null) {
    query = "rows=100&q=" + q;
  } else {
    res.status(400).json({ error: "search failed" });
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "x-cadde-search": "detail",
    "x-cadde-dataspace": "dataex",
    "x-cadde-provider": req.headers["x-cadde-provider"],
    Authorization: req.headers["authorization"],
  };
  const url =
    (req.headers["consumer-connector-origin"] as string) +
    "cadde/api/v4/catalog?" +
    query;
  fetchHttps(url, {
    method: "GET",
    headers: headers,
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res.json();
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error: { status: number }) => {
      console.log(error);
      res.status(error.status).json({ error: "search failed" });
    });
}
