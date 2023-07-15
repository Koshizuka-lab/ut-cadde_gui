import React, { useState } from 'react'
import { Distribution } from '../types'


function MetaSearch() {
    const [url, setUrl] = useState("")
    const [dataArr, setDataArr] = useState([])
    
    const doChange = (e) => {
        setUrl("./api/metacatalog?q=" + e.target.value)
    }

    const RowItem = ((data: Distribution) => {
        return (
            <tr>
                <td>{data["title"]}</td>
                <td>{data["resource_name"]}</td>
                <td>{data["provider_name"]}</td>
                <td>{data["data_type"]}</td>
                <td>{data["updated_time"]}</td>
                <td>
                    <button className="btn btn-secondary btn">
                        <a href={data["url"]} target="_blank">詳細</a>
                    </button>
                </td>
            </tr>
        )
    })

    const createTable = (res: Array<Distribution>) => {
        // 表データの作成
        let arr = []
        for (var key in Object.keys(res)) {
            arr.push(RowItem(res[key]))
        }
        setDataArr(arr)
    }

    const doAction = (e) => {
        e.preventDefault()
        // データの取得
        fetch(url, {method: "GET"})
        .then(res  => res.json())
        .then((json) => {
            createTable(json)
            console.log(json)
        })
    }

    return (
        <div>
            <h1 className='card-title'>データ検索</h1>
                <div className='container'>
                    <form onSubmit={doAction}>
                        <div className='form-row'>
                            <div className='form-group mr-1 col-5'>
                                <label className="form-label">検索ワード</label>
                                <input type="text" className='form-control' onChange={doChange} required placeholder=""/>  
                            </div>
                            <div className='form-group'>
                                <label className="form-label">　</label>
                                <input type="submit" className="btn btn-primary btn" value="検索"/>
                            </div>
                        </div>
                    </form>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>データセット名</th>
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