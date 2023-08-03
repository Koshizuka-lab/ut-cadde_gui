import fetch from 'node-fetch'

const fetchHttps = (url, options) => {
    console.log("--- fetchHttps ---")
    console.log("url: " + url)
    console.log("method: " + options["method"])
    for (const key in options['headers']) {
        console.log("key: " + key + ", value: " + options["headers"][key])
    }
    const https = require('https')
    const fs = require('fs')

    // カスタム証明書を読み込む
    const customCert = fs.readFileSync(process.env.ROOT_CA_CERTIFICATE)
    const agent = new https.Agent({
        ca: customCert
    })
    options.agent = agent
    return fetch(url, options)
}

const fetchWithTimeout = (url, options, timeout = 3000) => {
    return Promise.race([
        fetchHttps(url, options),
        new Promise((_, reject) =>
        setTimeout(() => {
            reject(new Error('リクエストがタイムアウトしました'))
        }, timeout)
        )
    ])
}

export { fetchHttps, fetchWithTimeout }
