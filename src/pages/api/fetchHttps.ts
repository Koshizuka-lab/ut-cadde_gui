import fetch from 'node-fetch'      
import type { Options } from '@/types/api'

const fetchHttps = (url: string, options: Options) => {
  console.log("--- fetchHttps ---")
  console.log("url: " + url)
  console.log("method: " + options["method"])
  for (const [key, value] of Object.entries(options["headers"])) {
      console.log("key: " + key + ", value: " + value)
  }
  console.log("-----------------")
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