import Layout from "../components/Layout"
import React from 'react'
import RegisterCatalog from "../components/RegisterCatalog"
import SearchPackage from "../components/SearchPackage"

export default function AddCatalog() {
  return (
    <div>
      <Layout>
        <RegisterCatalog />
        <SearchPackage />
      </Layout>
    </div>
  )
}
