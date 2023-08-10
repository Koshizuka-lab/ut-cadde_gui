import Layout from "../components/Layout"
import React, { useState, useEffect } from 'react'
import Provider from "../components/olds/Provider"
import {
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";


export default function DataExchangePeriodical() {
  const [providers, setProviders] = useState([])

  useEffect(() => {
    fetch('/api/providers_periodical')
      .then(res => res.json())
      .then(data => {
        setProviders(data)
      })
  }, [])


  return (
    <Layout >
      <Box>
        <Heading as="h1" size="xl" my="1rem">
          定期データ取得
        </Heading>
        <Text fontSize="lg" my="1rem">
          契約先法人一覧
        </Text>
        {providers.map((provider) => (<Provider key="" tag="period" provider={provider}/>))}
      </Box>
    </Layout>
  )
}
