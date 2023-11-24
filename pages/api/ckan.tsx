import fetch from 'node-fetch'
import { NextApiRequest, NextApiResponse } from "next"

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJKOWwwSEJZTUxFTC1OQWFVeHRwU29RTGVVOTB2UVNkN2ZDbkV6RUMyNHRVIiwiaWF0IjoxNzAwODExOTEwfQ._F2Mqm8G0sxmtWxmGrEVz1bXhQsCa8_wyTMaSGmJ6dg"

export default function ckan(req: NextApiRequest, res: NextApiResponse) {
    const url = req.query.url as string
    const body = req.body

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': API_KEY,
        },
        body: JSON.stringify(body)
    })
    .then((res: Response) => res.json())
    .then((data: any) => {
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({"error": "ckan failed"})
    })
}
