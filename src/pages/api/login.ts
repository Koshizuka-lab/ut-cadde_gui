import { NextApiRequest, NextApiResponse } from "next"
import fetchHttps from "./fetchHttps"
import { LoginAuthResponse } from "@/types/api"

export default function login(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.body.userID
    const password = req.body.password

    const client_id = "consumer1_webapp"
    const client_secret = "X0IwpZHnuFI8uduRkM5RV5A8F1XJwF3T"
    const basic = btoa(`${client_id}:${client_secret}`)

    const url = process.env.AUTH_API_URL + "token"
    fetchHttps(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basic}`,
        },
        body: JSON.stringify({
            "user_id": userID, 
            "password": password, 
        })
    })
    .then((res) => res.json())
    .then((data: LoginAuthResponse) => {
        console.log(data)
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
        res.status(error.status).json({"error": "login failed"})
    })
}
