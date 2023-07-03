import React, { useState } from 'react'
import DetailSearch from './DetailSearch'
import Download from './Download'
import styles from "../styles/Home.module.css"




function DetailSearchDownload(props) {
    const [pID, setPID] = useState("")
    const [dataID, setDataID] = useState("")
    const [token, setToken] = useState("")
    const [resourceUrl, setResourceUrl] = useState("")
    const [resourceType, setResourceType] = useState("")

    return (
        <div>
            <DetailSearch test={props.test} hostname={props.hostname} port={props.port} setPID={setPID} setDataID={setDataID} setToken={setToken} setResourceUrl={setResourceUrl} setResourceType={setResourceType} />
            <Download test={props.test} hostname={props.hostname} port={props.port} pID={pID} token={token} resourceUrl={resourceUrl} resourceType={resourceType} setResourceUrl={setResourceUrl} />
        </div>
    )
}

export default DetailSearchDownload