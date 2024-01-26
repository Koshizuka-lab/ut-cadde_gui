import { NextApiRequest, NextApiResponse } from "next";

import { SearchErrorResponse, SearchResponse } from "@/types/api";

import fetchHttps from "../../fetchHttps";

export default async function meta(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { message: string }>,
) {
  const { q, fq } = req.query as { q: string; fq: string };
  let query: string;
  if (fq != null) {
    query = "rows=100&fq=" + fq;
  } else if (q != null) {
    query = "rows=100&q=" + q;
  } else {
    res.status(400).json({ message: "invalid query" });
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "x-cadde-search": "meta",
    "x-cadde-dataspace": "dataex",
  };
  const url =
    (req.headers["consumer-connector-origin"] as string) +
    "cadde/api/v4/catalog?" +
    query;

  try {
    const response = await fetchHttps(url, {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      const data: SearchResponse = (await response.json()) as SearchResponse;
      res.status(200).json(data);
    } else {
      const error: SearchErrorResponse =
        (await response.json()) as SearchErrorResponse;
      res.status(error.status).json({ message: error.detail });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}
