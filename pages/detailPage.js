import Layout from "../components/layout"
import Dataset from "../components/ContentTable"
import Link from "next/link"

export default function DetailPage(props) {
  return (
    <Layout header="UT-CADDE" title="UT-CADDE">
        <div className='container'>
          <ContentTable />
          <Download test={props.test} hostname={props.hostname} port={props.port}/>
        </div>
      </Layout>
  )
}
