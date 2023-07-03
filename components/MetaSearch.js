import React, { useState } from 'react'
import { getHttp, get_options }from './func'
import styles from "../styles/Home.module.css"


function MetaSearch(props) {
    const [url, setUrl] = useState("")
    const [response, setResponse] = useState({})
    const [dataArr, setDataArr] = useState([])
    
    const doChange = (e) => {
        if (props.test) {
            setUrl("./api/metacatalog?q=" + e.target.value)
        } else {
            setUrl("http://" + props.hostname + ":" + props.port + '/cadde/api/v4/catalog?q=' + e.target.value)
        }
    }

    const RowItem = ((data) => {
        return (
            <tr>
                <td>{data["title"]}</td>
                <td>{data["provider_name"]}</td>
                <td>{data["data_type"]}</td>
                <td>{data["updated_time"]}</td>
                <td>
                    <button className="btn btn-secondary btn">
                        <a href="example.com" target="_blank">詳細</a>
                    </button>
                </td>
            </tr>
        )
    })

    const doAction = (e) => {
        e.preventDefault()
        setDataArr([])
        var options = {}
        if (props.test) {
            options = get_options({tag: "test", url: url})
        } else {
            options = get_options({tag: "meta", url: url})
        }
        console.log(options)
        // データの取得
        getHttp(options, setResponse)
        console.log(response)

        // 表データの作成
        let arr = []
        for (var key in Object.keys(response)) {
            arr.push(RowItem(response[key]))
        }
        setDataArr(arr)
    }

    return (
        <div>
            <h1 className='card-title'>データ検索</h1>
                <div className='container'>
                    <form onSubmit={doAction}>
                        <div className='form-row'>
                            <div className='form-group mr-1 col-5'>
                                <label clasName="form-label">検索ワード</label>
                                <input type="text" className='form-control' onChange={doChange} required placeholder=""/>  
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
                                <th>配信名</th>
                                <th>提供者</th>
                                <th>データ形式</th>
                                <th>最終更新日</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataArr}
                        </tbody>
                    </table>
                </div>            
        </div>
    )
}



export default MetaSearch