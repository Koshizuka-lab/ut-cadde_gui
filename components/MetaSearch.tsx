import React, { useState } from 'react'
import { Dataset } from '../types'
import { Input, Button, FormControl, Flex, Spacer, Box } from "@chakra-ui/react"
import DatasetBlock from './DatasetBlock'


function MetaSearch() {
    const [url, setUrl] = useState("")
    const [dataArr, setDataArr] = useState([])
    
    const doChange = (e) => {
        setUrl("./api/metacatalog?q=" + e.target.value)
    }

    const doAction = (e) => {
        e.preventDefault()
        // clear data if search word is empty
        if (url == "./api/metacatalog?q="){
            setDataArr([])
            return
        }

        fetch(url, {method: "GET"})
        .then(res  => res.json())
        .then((json) => {
            displayDatasets(json)
            console.log(json)
        })
    }

    const displayDatasets = (datasetArr: Array<Dataset>) => {
        console.log(datasetArr)
        if (datasetArr.length == 0) {
            setDataArr([])
            return
        }
        let newDataArr = []
        for (let dataset of datasetArr) {
            newDataArr.push(<DatasetBlock dataset={dataset} />)
        }
        
        setDataArr(newDataArr)
    }

    return (
        <Box>
            <h1>Search data</h1>
            <Flex minWidth="max-content" alignItems="center" gap="2" pb="10">
                <FormControl p="2">
                    <Input
                        onChange={doChange}
                        placeholder="search word"
                    />
                </FormControl>
                <Spacer />
                <Button
                    type="submit"
                    colorScheme="teal"
                    width="sm"
                    onClick={doAction}
                >
                    Search
                </Button>
            </Flex>
            {dataArr}
        </Box>
    )
}

export default MetaSearch