import fetch from 'node-fetch'      

interface Options { 
    method: string
    headers: { // login
        'Content-Type': string 
    } | { // fetch metacatalog
        'Content-Type': string 
        'Cache-Control': string 
        'x-cadde-search': string 
    } | { // fetch deteilcatalog
        'Content-Type': string 
        'Cache-Control': string 
        'x-cadde-search': string 
        "x-cadde-provider": string 
        "Authorization": string 
    } | { // fetch resource
        'Content-Type': string 
        'Cache-Control': string 
        'x-cadde-resource-url': string 
        'x-cadde-resource-api-type': string 
        'x-cadde-provider': string 
        "Authorization": string 
    }
    body?: string
    agent?: any 
}

const fetchHttps = (url: string, options: Options) => {
    console.log("--- fetchHttps ---")
    console.log("url: " + url)
    console.log("method: " + options["method"])
    for (const key in options["headers"]) {
        console.log("key: " + key + ", value: " + options["headers"][key])
    }
    const https = require("https")
    const fs = require("fs")

    // カスタム証明書を読み込む
    const customCert = fs.readFileSync(process.env.ROOT_CA_CERTIFICATE)
    const agent = new https.Agent({
        ca: customCert
    })
    options.agent = agent
    return fetch(url, options)
}

export default fetchHttps