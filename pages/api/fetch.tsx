import fetch from 'node-fetch'

const fetchHttps = (url, options) => {
    const https = require('https')
    const fs = require('fs')

    // カスタム証明書を読み込む
    const customCert = fs.readFileSync('./cacert.pem')
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
