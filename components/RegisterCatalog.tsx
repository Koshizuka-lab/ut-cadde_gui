import React from 'react'
import { useState } from "react"
import { Text, Button, Input, Heading, Container, Flex, useToast } from "@chakra-ui/react"
import { CKAN } from "./CKAN"
import { Package, Resource } from "../types"

export default function RegisterCatalog() {
  const [dataset, setDataset] = useState({} as Package)
  const [resource, setResource] = useState({} as Resource)
  const [datasetId, setDatasetId] = useState("")
  const [parentDir, setParentDir] = useState("")
  const [files, setFiles] = useState([] as Array<string>)

  const client = new CKAN('http:///172.26.16.16:5000')

  const toast = useToast()

  const createPackage = () => {
    let datasetId = ""
    const body: Package = {
        "name": dataset.title,
        "title": dataset.title,
        "notes": dataset.notes,
        "owner_org": dataset.owner_org,
        "caddec_provider_id": dataset.caddec_provider_id,
        "caddec_dataset_id_for_detail": dataset.title,
        "extras": [
            {
                "key": "caddec_provider_id",
                "value": dataset.caddec_provider_id
            },
            {
            "key": "caddec_dataset_id_for_detail",
            "value": dataset.title
            },        
        ]
    }
    client.createPackage(body, (err, data) => {
      if (!err) {
        datasetId = data["result"]["id"]
        setDatasetId(datasetId)
        toast({
            title: "Success",
            description: "Dataset created",
            status: "success",
            duration: 3000,
            isClosable: true,
            })
      }
    })
  }

  const addResource = () => {
    const body: Resource = {
      "package_id": datasetId,
      "name": resource.name,
      "description": resource.description,
      "format": resource.format,
      "url": parentDir + resource.url
    }
    client.createResource(body, (err, data) => {
      if (!err) {
        console.log(data)
        toast({
          title: "Success",
          description: "Resource added",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
      }
    })
  }

  const addResources = (parentDir: string, files: Array<string>) => {
    for (const file of files) {
      const body: Resource = {
        "package_id": datasetId,
        "name": file,
        "description": "",
        "format": file.split(".")[-1],
        "url": parentDir + file
      }
      client.createResource(body, (err, data) => {
        if (!err) {
          console.log(data)
            toast({
                title: "Success",
                description: "Resource added",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
        }
      })
    }
  }

  const clear = () => {
    setDataset({} as Package)
    setResource({} as Resource)
    setDatasetId("")
  }

  return (
    <Container maxW="container.lg">
        <Heading>Register Catalog</Heading>
        <Text fontWeight="bold" fontSize="2xl" mt="5">Create Dataset</Text>
        <Input type="text" onChange={(e) => setDataset({...dataset, title: e.target.value})} placeholder="title" />
        <Input type="text" onChange={(e) => setDataset({...dataset, notes: e.target.value})} placeholder="notes" />
        <Input type="text" onChange={(e) => setDataset({...dataset, owner_org: e.target.value})} placeholder="owner_org" />
        <Input type="text" onChange={(e) => setDataset({...dataset, caddec_provider_id: e.target.value})} placeholder="caddec_provider_id" />
        <Flex>
          <Button onClick={createPackage} mt="2">create dataset</Button>
          <Text fontSize="xl" m="3">dataset ID：{datasetId}</Text>
        </Flex>

        <Text fontWeight="bold" fontSize="2xl" mt="5">Add Resource</Text>
        <Input type="text" onChange={(e) => setResource({...resource, name: e.target.value})} placeholder="name" />
        <Input type="text" onChange={(e) => setResource({...resource, description: e.target.value})} placeholder="description" />
        <Input type="text" onChange={(e) => setResource({...resource, format: e.target.value})} placeholder="format" />
        <Input type="text" onChange={(e) => setResource({...resource, url: e.target.value})} placeholder="url" />
        <Input type="text" onChange={(e) => setDatasetId(e.target.value)} placeholder="dataset ID" defaultValue={datasetId} />
        <Button onClick={addResource} mt="2">add resource</Button>

        <Text fontWeight="bold" fontSize="2xl" mt="5">Add Multipul Resources</Text>
        <Input type="text" onChange={(e) => setParentDir(e.target.value)} placeholder="parent directory" />
        <Input type="text" onChange={(e) => setFiles(e.target.value.split(","))} placeholder="file names (splited by ,)" />
        <Input type="text" onChange={(e) => setDatasetId(e.target.value)} placeholder="dataset ID" defaultValue={datasetId} />
        <Button onClick={() => addResources(parentDir, files)} mt="2">add resources</Button>
        <Button onClick={clear} mt="5" w="100%">clear</Button>
        
    </Container>
  )
}