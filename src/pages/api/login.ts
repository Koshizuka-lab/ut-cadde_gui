import { NextApiRequest, NextApiResponse } from "next";

import { LoginAuthResponse, LoginErrorResponse } from "@/types/api";

import fetchHttps from "./fetchHttps";

export default function login(
  req: NextApiRequest,
  res: NextApiResponse<LoginAuthResponse | { message: string }>,
) {
  const { userID, password } = req.body as { userID: string; password: string };

  const client_id = "consumer1_webapp";
  const client_secret = "X0IwpZHnuFI8uduRkM5RV5A8F1XJwF3T";
  const basic = btoa(`${client_id}:${client_secret}`);

  const url = process.env.AUTH_API_URL + "token";
  fetchHttps(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basic}`,
    },
    body: JSON.stringify({
      user_id: userID,
      password: password,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error = (await response.json()) as LoginErrorResponse;
        res
          .status(error.status)
          .json({ message: error.detail.error_description });
      } else {
        const data = (await response.json()) as LoginAuthResponse;
        res.status(200).json(data);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    });
}
