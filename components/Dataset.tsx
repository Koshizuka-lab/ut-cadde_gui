import React, { useState, useEffect } from 'react'
import DistributionTable from './DistributionTable'
import { Distribution } from '../types'
import {Box, Heading, Flex, Button, Spacer} from "@chakra-ui/react";

interface DatasetProps {
    title: string,
    distributions: Array<Distribution>
}

function Dataset(props: DatasetProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const doAction = ((e) => {
        e.preventDefault()
        let is_expanded = isExpanded
        is_expanded = !is_expanded
        setIsExpanded(is_expanded)
        console.log("isExpanded", isExpanded)
    })

    return (
        <Box >
            <Flex boxShadow="md" m="5">
                <Box fontSize="3xl" p="2">
                    {props.title}
                </Box> 
                <Spacer />
                <Box p="2">
                    {!isExpanded && <Button onClick={doAction}>配信を表示</Button>}
                    {isExpanded && <Button onClick={doAction}>閉じる</Button>}
                </Box>
            </Flex>
            <Box>
                {isExpanded && (
                    <DistributionTable distributions={props.distributions}/>
                )}
            </Box>
        </Box>
    )
}

export default Dataset