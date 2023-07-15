import { fetchHttps } from './fetch'

export default function login(req, res) {
    const userID = req.body.userID
    const password = req.body.password

    fetch("http://172.26.16.20:18080/cadde/api/v4/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "user_id": userID, 
            "password": password, 
            "client_id": "consumer1_webapp", 
            "client_secret": "X0IwpZHnuFI8uduRkM5RV5A8F1XJwF3T"
        })
    })
    .then(res => res.json())
    .then((data) => {
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({"error": "login failed"})
    })
}