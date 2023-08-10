import React, { useState, useEffect } from 'react'
import { Dataset, Distribution } from '../types'
import {
    Box, 
    Flex, 
    Button, 
    Spacer,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Th,
    TableContainer,
} from '@chakra-ui/react'  
import Download from './Download'


interface DatasetBlockProps {
    dataset: Dataset
}
function DatasetBlock(props: DatasetBlockProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    let dataset = props.dataset

    useEffect(() => {
        setIsExpanded(false)
    }, [props])

    const doAction = ((e) => {
        e.preventDefault()
        setIsExpanded(!isExpanded)
    })

    return (
        <Box >
            <Box  borderWidth="0.5px" borderRadius="lg" borderColor="black" m="3">
                <Flex m="3">
                    <Box fontSize="3xl" p="2">
                        {dataset.title}
                    </Box> 
                    <Spacer />
                    <Box p="2">
                        {
                            isExpanded 
                            ? <Button onClick={doAction}>Close</Button> 
                            : <Button onClick={doAction}>Show distributions</Button>
                        }
                    </Box>
                </Flex>
                <TableContainer >
                    {isExpanded && (
                        createTable(dataset.distributions)
                    )}
                </TableContainer>
            </Box>
        </Box>
    )
}

function createTable(distributions: Array<Distribution>) {
    return (
        <Table letiant="striped" size="md">
            <Thead>
                <Tr>
                <Th>DisTribution Title</Th>
                <Th>Provider</Th>
                <Th>Data Type</Th>
                <Th>Last Updated Time</Th>
                <Th>Description</Th>
                <Th></Th>
            </Tr>
            </Thead>
            <Tbody>
                {distributions.map((distribution) => createRowItem(distribution))}
            </Tbody>
        </Table>
    )
}

function createRowItem(data: Distribution) {
    return (
        <Tr>
            <Td>{data.resourceName}</Td>
            <Td>{data.providerName}</Td>
            <Td>{data.dataType}</Td>
            <Td>{data.updatedTime}</Td>
            <Td>{adjustDescriptionLength(data.description)}</Td>
            <Td>
                <Download 
                    caddecDatasetIdForDetail={data.caddecDatasetIdForDetail} 
                    providerId={data.caddecProviderId}
                    resourceName={data.resourceName}
                />
            </Td>
        </Tr>
    )
}

function adjustDescriptionLength(description: string, maxLength: number = 25) {
    if (description.length > maxLength) {
        return description.slice(0, maxLength) + "..."
    } else {
        return description + (" ".repeat(maxLength - description.length))
    }
}

export default DatasetBlock