import React, { useState } from 'react'
import { getHttp, get_options } from '../func'
import styles from "../styles/Home.module.css"

function DetailSearch(props) {
    const [url, setUrl] = useState("")
    const [response, setResponse] = useState({})
    const [dataID, setDataID] = useState("")
    
    const doChangePID = (e) => {
        props.setPID(e.target.value)
    }
    const doChangeDataID = (e) => {
        if (props.test) {
            setUrl("./api/detailcatalog?q=" + e.target.value)
        } else {
            setUrl(
                'http://' + props.hostname + ':' + props.port + '/cadde/api/v4/catalog?fq=caddec_dataset_id_for_detail:' + e.target.value
            )
        }
    }
    const doChangeToken = (e) => {
        props.setToken(e.target.value)
    }

    const doAction = (e) => {
        e.preventDefault()
        const options = get_options({tag: "test", url: url})
        getHttp(options, setResponse)
        // 取得データの保存
        props.setPID(response["extras:caddec_provider_id"])
        setDataID(response["extras:caddec_dataset_id_for_detail"])
        props.setResourceUrl(response["resources:download_url"])
        props.setResourceType(response["resources:caddec_resource_type"])
    }

    return (
        <div className={styles.card}>
            <h4 className='card-title'>詳細検索</h4>
            <div className='container'>
                <form onSubmit={doAction} action="">
                    <div className='form-row'>
                    <div className='form-group mr-1'>
                        <label clasName="form-label">提供者ID</label>
                        <input type="text" className='form-control' onChange={doChangePID} required placeholder=''/>
                       </div>
                    <div className='form-group mr-1'>
                        <label clasName="form-label">詳細データセットID</label>
                        <input type="text" className='form-control' onChange={doChangeDataID} required placeholder=''/>
                        
                    </div>
                    <div className='form-group mr-1'>
                        <label clasName="form-label">認証トークン</label>
                        <input type="text" className='form-control' onChange={doChangeToken} required placeholder=''/>
                    </div>
                    <div className='form-group'>
                        <label clasName="form-label">　</label>
                        <input type="submit" className="btn btn-primary btn" value="検索"/>
                    </div>
                    </div>
                </form>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>リソースURL</th>
                            <th>リソース提供手段</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{response["title"]}</td>
                            <td>{response["resources:download_url"]}</td>
                            <td>{response["resources:caddec_resource_type"]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DetailSearch