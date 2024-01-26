import { NextApiRequest, NextApiResponse } from "next";

import fetchHttps from "./fetchHttps";

export default function login(req: NextApiRequest, res: NextApiResponse) {
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
    .catch((error: { status: number }) => {
      console.log(error);
      res.status(error.status).json({ error: "login failed" });
    });
}
