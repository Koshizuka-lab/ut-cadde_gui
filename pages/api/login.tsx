import { LoginAuthResponse } from '../../types'
import fetchHttps from './fetchHttps'
import { NextApiRequest, NextApiResponse } from "next"

export default function login(req: NextApiRequest, res: NextApiResponse) {
    const userID = req.body.userID
    const password = req.body.password

    const client_id = "consumer1_webapp"
    const client_secret = "X0IwpZHnuFI8uduRkM5RV5A8F1XJwF3T"
    const basic = btoa(`${client_id}:${client_secret}`)

    fetchHttps("https://172.26.16.20:18443/cadde/api/v4/token", {
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
    .then((res: Response) => res.json())
    .then((data: LoginAuthResponse) => {
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({"error": "login failed"})
    })
}
