import { NextApiRequest, NextApiResponse } from "next";

import fetchHttps from "@/utils/fetchHttps";
import { getLogger } from "@/utils/logger";

import { SearchErrorResponse, SearchResponse } from "@/types/api_external";
import {
  ErrorResponse,
  SearchResponse as _SearchResponse,
} from "@/types/api_internal";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *    Bearer:
 *      type: http
 *      scheme: bearer
 * /api/ut-cadde/search/meta:
 *   get:
 *     summary: Meta catalog search
 *     description: Search the cadde catalog
 *     parameters:
 *      - in: header
 *        name: consumer-connector-origin
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: q
 *        required: false
 *        schema:
 *          type: string
 *      - in: query
 *        name: fq
 *        required: false
 *        schema:
 *          type: string
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: search result
 *       400:
 *         description: invalid search type
 *       401:
 *         description: don't have permission to access
 *       403:
 *         description: don't have permission to access
 *       500:
 *         description: internal server error
 */
export default async function meta(
  req: NextApiRequest,
  res: NextApiResponse<_SearchResponse | ErrorResponse>,
) {
  const logger = getLogger("/api/ut-cadde/search/meta");

  const { q, fq } = req.query as { q: string; fq: string };
  let query: string;
  if (fq != null) {
    query = "rows=100&fq=" + fq;
  } else if (q != null) {
    query = "rows=100&q=" + q;
  } else {
    logger.error("invalid query");
    res.status(400).json({ message: "invalid query" });
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "x-cadde-search": "meta",
  };
  if (!req.headers["consumer-connector-origin"]) {
    logger.error("missing consumer-connector-origin header");
    res.status(400).json({
      message:
        "Missing consumer connector ID. Please choose one at settings page.",
    });
    return;
  }
  const url =
    (req.headers["consumer-connector-origin"] as string) +
    "cadde/api/v4/catalog?" +
    query;

  logger.info("search cadde catalog");
  try {
    const response = await fetchHttps(url, {
      method: "GET",
      headers: headers,
    });
    logger.debug(response);
    if (response.ok) {
      const data: SearchResponse = (await response.json()) as SearchResponse;
      data.result.results.map((dataset) => {
        logger.debug(dataset.title);
        logger.debug(dataset.resources);
        if (dataset.resources) {
          dataset.resources.map((resource) => {
            logger.debug(resource.url);
          });
        }
      });
      res.status(200).json(data);
    } else {
      const error: SearchErrorResponse =
        (await response.json()) as SearchErrorResponse;
      logger.error(error);
      res.status(error.status).json({ message: error.detail });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
}