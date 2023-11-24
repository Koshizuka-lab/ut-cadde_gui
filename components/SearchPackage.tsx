import React, { useState } from 'react'
import { CKAN } from "./CKAN"
import { Button, Input, Heading, Th, Tr, Table, Td, Thead, Tbody, Container, Flex } from "@chakra-ui/react"


export default function SearchPackage() {
    interface Catalog {
        name: string,
        id: string
    }
    const [datasetQuery, setDatasetQuery] = useState("")
    const [catalogs, setCatalogs] = useState([] as Array<Catalog>)
    const client = new CKAN('http:///172.26.16.16:5000')

    const searchPackage = () => {
        client.searchPackage(datasetQuery, (err, data) => {
          if (!err) {
            const catalogs: Array<Catalog> = []
            for (const result of data["result"]["results"]) {
              catalogs.push({
                name: result["title"],
                id: result["id"]
              })
            }
            setCatalogs(catalogs)
          }
        })
    }

    return (
        <Container maxW="container.lg">
          <Heading mt="10" mb="5">Search Dataset ID</Heading>
          <Flex gap="4">
            <Input type="text" onChange={(e) => setDatasetQuery(e.target.value)} placeholder="dataset name" />
            <Button onClick={searchPackage} px="20">search</Button>
          </Flex>
          <Table>
            <Thead>
              <Tr>
                <Th>name</Th>
                <Th>id</Th>
              </Tr>
            </Thead>
            <Tbody>
              {catalogs.map((catalog, key) => {
                return (
                  <Tr key={key}>
                    <Td>{catalog.name}</Td>
                    <Td>{catalog.id}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Container>
    )
}