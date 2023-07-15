import Layout from "../components/Layout"
import React, { useState, useEffect } from 'react'
import Provider from "../components/Provider"
import {
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";


export default function DataExchangeImmediate() {
  const [providers, setProviders] = useState([])

  useEffect(() => {
    fetch('/api/providers_immediate')
      .then(res => res.json())
      .then(data => {
        setProviders(data)
      })
  }, [])


  return (
    <Layout >
      <Box>
        <Heading as="h1" size="xl" my="1rem">
          契約先法人一覧
        </Heading>
        {/* <Text fontSize="lg" my="1rem">
          契約先法人一覧
        </Text> */}
        {providers.map((provider) => (<Provider key="" tag="immed" provider={provider}/>))}
      </Box>
    </Layout>
  )
}
