import { NextApiRequest, NextApiResponse } from "next"
import fetchHttps from "./fetchHttps"
import { LoginAuthResponse } from "@/types/api"

export default function refresh(req: NextApiRequest, res: NextApiResponse) {
    const refresh_token = req.body.refresh_token

    const client_id = "consumer1_webapp"
    const client_secret = "X0IwpZHnuFI8uduRkM5RV5A8F1XJwF3T"
    const basic = btoa(`${client_id}:${client_secret}`)

    fetchHttps("https://172.26.16.20:18443/cadde/api/v4/refresh", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basic}`,
        },
        body: JSON.stringify({
            "refresh_token": refresh_token, 
        })
    })
    .then((res) => res.json())
    .then((data: LoginAuthResponse) => {
        console.log(data)
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({"error": "login failed"})
    })
}
