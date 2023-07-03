import React, { useState } from 'react'
import { get_options, fetchDownload } from './func'

function Download(props) {
    const [url, setUrl] = useState("")

    const doAction = (e) => {
        e.preventDefault()
        var filename = "data.json"
        if (props.test) {
            setUrl("./" + filename)
        } else {
            setUrl('http://' + props.hostname + ':' + props.port + '/cadde/api/v4/file')
        }
        var options = {}
        if (props.test) {
            options = get_options({tag: "test", url: url})
        } else {
            options = get_options({tag: "download", url: url})
        }
        // ファイルの取得とダウンロード
        console.log(options)
        fetchDownload(options, filename)
    }

    return (
        <button onClick={doAction} className="btn btn-primary btn">ダウンロード</button>
    )
}

export default Download