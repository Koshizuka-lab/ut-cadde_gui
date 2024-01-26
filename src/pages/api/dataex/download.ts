import { NextApiRequest, NextApiResponse } from "next";

import { SearchErrorResponse } from "@/types/api";

import fetchHttps from "../fetchHttps";

export default async function download(
  req: NextApiRequest,
  res: NextApiResponse<string | { message: string }>,
) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "x-cadde-resource-url": req.headers["x-cadde-resource-url"],
    "x-cadde-resource-api-type": req.headers["x-cadde-resource-api-type"],
    "x-cadde-provider": req.headers["x-cadde-provider"],
    Authorization: req.headers["authorization"],
  };
  const url =
    (req.headers["consumer-connector-origin"] as string) + "cadde/api/v4/file";
  try {
    const response = await fetchHttps(url, {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      const data = await response.text();
      res.status(200).send(data);
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
