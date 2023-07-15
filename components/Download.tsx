import React from 'react'

interface DownloadProps {
    url: string,
    resourceUrl: string,
    resourceType: string,
    pID: string,
    token: string,
}

function Download(props: DownloadProps) {
    
    const downloadFile = ((blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })

    const doAction = (e) => {
        e.preventDefault()
        let filename = props.url.split("/").pop()
        // ファイルの取得とダウンロード
        console.log(props.url, filename)
        fetch(props.url, {
            method: "GET", 
            headers: {
                'Cache-Control': 'no-cache',
                'x-cadde-resource-url': props.resourceUrl,
                'x-cadde-resource-api-type': props.resourceType,
                'x-cadde-provider': props.pID,
                'Authorization:Bearer': props.token
            },
        }).then((res) => res.blob())
        .then(
            blob => {
                downloadFile(blob, filename)
            }
        ).catch(error => {
            console.log("Cannot fetch from API. Try to fetch from local server.")
            fetch(props.url, {
                method: "GET", 
            }).then((res) => res.blob())
            .then(
                blob => {
                    downloadFile(blob, filename)
                }
            )
        })
    }

    return (
        <button onClick={doAction} className="btn btn-primary btn">ダウンロード</button>
    )
}

export default Download