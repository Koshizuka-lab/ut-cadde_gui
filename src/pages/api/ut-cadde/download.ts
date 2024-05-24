import { NextApiRequest, NextApiResponse } from "next";

import fetchHttp from "@/utils/fetchHttps";
import { getLogger } from "@/utils/logger";

import { ErrorResponse } from "@/types/api_internal";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *    Bearer:
 *      type: http
 *      scheme: bearer
 * /api/ut-cadde/download:
 *   get:
 *     summary: Download file
 *     description: Fetch file through connectors
 *     parameters:
 *      - in: header
 *        name: x-cadde-resource-url
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: x-cadde-resource-api-type
 *        required: true
 *        schema:
 *          type: string
 *      - in: header
 *        name: x-cadde-provider
 *        required: false
 *        schema:
 *          type: string
 *      - in: header
 *        name: consumer-connector-origin
 *        required: true
 *        schema:
 *          type: string
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: invalid user identification
 *       401:
 *         description: don't have permission to access
 *       403:
 *         description: don't have permission to access
 *       404:
 *         description: resource not found
 *       500:
 *         description: internal server error
 */
export default async function download(
  req: NextApiRequest,
  res: NextApiResponse<Buffer | ErrorResponse>,
) {
  const logger = getLogger("/api/download");

  let headers;
  if (req.headers["x-cadde-provider"]) {
    headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "x-cadde-resource-url": req.headers["x-cadde-resource-url"] as string,
      "x-cadde-resource-api-type": req.headers[
        "x-cadde-resource-api-type"
      ] as string,
      "x-cadde-provider": req.headers["x-cadde-provider"] as string,
      Authorization: req.headers["authorization"],
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "x-cadde-resource-url": req.headers["x-cadde-resource-url"] as string,
      "x-cadde-resource-api-type": req.headers[
        "x-cadde-resource-api-type"
      ] as string,
      Authorization: req.headers["authorization"],
    };
  }
  if (!req.headers["consumer-connector-origin"]) {
    logger.error("missing consumer-connector-origin header");
    res.status(400).json({
      message:
        "Missing consumer connector ID. Please choose one at settings page.",
    });
    return;
  }
  const url =
    (req.headers["consumer-connector-origin"] as string) + "cadde/api/v4/file";
  logger.info("fetch file from provider");
  try {
    const response = await fetchHttp(url, {
      method: "GET",
      headers: headers,
    });
    console.log(response);
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      const contentDisposition = response.headers.get("content-disposition");
      response.body?.pipe(res);
      if (contentType) {
        res.setHeader("Content-Type", contentType);
      }
      if (contentDisposition) {
        res.setHeader("Content-Disposition", contentDisposition);
      }
    } else {
      if (response.status === 400) {
        res.status(400).json({ message: "Invalid user identification." });
      } else if (response.status === 401) {
        res.status(401).json({
          message: "Invalid user. You don't have permission to access.",
        });
      } else if (response.status === 403) {
        res.status(403).json({
          message: "Invalid user. You don't have permission to access.",
        });
      } else if (response.status === 404) {
        res.status(404).json({
          message: "This resource is not found. Please contact the provider.",
        });
      } else {
        res
          .status(response.status)
          .json({ message: "Failed to fetch data from provider." });
      }
      logger.error(await response.text());
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
}