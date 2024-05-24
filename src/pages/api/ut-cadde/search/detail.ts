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
 * /api/ut-cadde/search/detail:
 *   get:
 *     summary: Provider catalog search
 *     description: Search the cadde catalog
 *     parameters:
 *      - in: header
 *        name: x-cadde-provider
 *        required: true
 *        schema:
 *          type: string
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
export default async function detail(
  req: NextApiRequest,
  res: NextApiResponse<_SearchResponse | ErrorResponse>,
) {
  const logger = getLogger("/api/ut-cadde/search/detail");

  const { q, fq } = req.query as { q: string; fq: string };
  let query: string;
  if (fq != null) {
    query = "rows=100&fq=" + fq;
  } else if (q != null) {
    query = "rows=100&q=" + q;
  } else {
    logger.error("Invalid query.");
    res.status(400).json({ message: "Invalid query." });
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "x-cadde-search": "detail",
    "x-cadde-provider": req.headers["x-cadde-provider"],
    Authorization: req.headers["authorization"],
  };
  const url =
    (req.headers["consumer-connector-origin"] as string) +
    "cadde/api/v4/catalog?" +
    query
  logger.info("search cadde catalog");
  try {
    const response = await fetchHttps(url, {
      method: "GET",
      headers: headers,
    });

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
      if (error.status === 400) {
        res.status(400).json({ message: "Invalid search type." });
      } else if (error.status === 403) {
        res.status(401).json({
          message: "Invalid user. You don't have permission to access.",
        });
      } else {
        res.status(400).json({ message: "Invalid provider connector ID. " });
      }
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
}