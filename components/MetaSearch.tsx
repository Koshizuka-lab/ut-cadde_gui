import React, { useState } from 'react'
import { Distribution } from '../types'
import Download from './Download'
import { Input, Button, FormControl, Flex, Spacer } from "@chakra-ui/react"
import Dataset from './Dataset'

function MetaSearch() {
    const [url, setUrl] = useState("")
    const [dataArr, setDataArr] = useState([])
    
    const doChange = (e) => {
        setUrl("./api/metacatalog?q=" + e.target.value)
    }

    const RowItem = ((data: Distribution) => {
        return (
            <tr>
                <td>{data["resource_name"]}</td>
                <td>{data["provider_name"]}</td>
                <td>{data["data_type"]}</td>
                <td>{data["updated_time"]}</td>
                <td>{data["description"]}</td>
                <td>
                    <Download 
                        caddec_dataset_id_for_detail={data["caddec_dataset_id_for_detail"]} 
                        provider_id={data["caddec_provider_id"]}
                        resource_name={data["resource_name"]}
                    />
                </td>
            </tr>
        )
    })

    const createTable = (res: Array<Distribution>) => {
        console.log(res)
        // 表データの作成
        let arr = []
        let datasetArr = []
        let dataset_name = res[Object.keys(res)[0]]["title"]
        for (var key in Object.keys(res)) {
            if (res[key]["title"] != dataset_name) {
                datasetArr.push(<Dataset title={dataset_name} distributions={arr}/>)
                arr = []
            }
            arr.push(RowItem(res[key]))
            dataset_name = res[key]["title"]
        }
        datasetArr.push(<Dataset title={dataset_name} distributions={arr}/>)
        
        setDataArr(datasetArr)
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

                <Flex minWidth="max-content" alignItems="center" gap="2" pb="10">
                    <FormControl p="2">
                        <Input
                            onChange={doChange}
                            placeholder="検索ワード"
                        />
                    </FormControl>
                    <Spacer />
                    <Button
                        type="submit"
                        variant="solid"
                        colorScheme="teal"
                        width="sm"
                        onClick={doAction}
                    >
                        検索
                    </Button>
                </Flex>
                {dataArr}
        </div>
    )
}



export default MetaSearch