import Layout from "../components/Layout"
import React from 'react'
import Login from "../components/Login"
import Home from "../components/Home"

export default function Index() {
  return (
    <div>
      <Layout >
        <Home />
      </Layout>
    </div>
  )
}
