export const getHttp = ((options, setResponse) => {
    fetch(options.url, {
        method: options.method, 
        headers: options.headers,
    }).then((res)  => {
        return res.json()
    })
    .then((json) => {
        setResponse(json)
        console.log(json)
    })
})

export const fetchDownload = ((options, filename) => {
    console.log(options.url)
    fetch(options.url, {
        method: options.method, 
        headers: options.headers,
    }).then((res) => res.blob())
    .then(
        blob => {
            downloadFile(blob, filename)
        }
    )
})

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

export const get_options = ((props) => {
    if (props.tag == "test") {
        return {
            url: props.url,
            method: "GET",
        }
    } else if (props.tag == "meta") {
        return {
            url: props.url,
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'x-cadde-search': 'meta'
            }
        }
    } else if (props.tag == "detail") {
        return {
            url: props.url,
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'x-cadde-search': 'detail',
                'x-cadde-provider': props.pID,
                'Authorization:Bearer': props.token
            }
        }
    } else if (props.tag == "download") {
        return {
            url: props.url,
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'x-cadde-resource-url': props.resourceUrl,
                'x-cadde-resource-api-type': props.resourceType,
                'x-cadde-provider': props.pID,
                'Authorization:Bearer': props.token
            }
        }
    }
})
