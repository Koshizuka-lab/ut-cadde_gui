import Layout from "../components/Layout"
import Link from "next/link"
import React from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {

  return (
    <div>
      {/* <Layout header="UT-CADDE" title="UT-CADDE"> */}
      <Layout >
        {/* <div className='container'>
          <div>
            <h3 className="py-5">
              <Link className={styles.card} href="https://search.ckan.jp" target="_blank">データ検索</Link>
            </h3>
            <h3 className="py-5">
              <Link className={styles.card} href="/get_immediate">即時データ取得</Link>
            </h3>
            <h3 className="py-5">
              <Link className={styles.card} href="/get_periodical">定期データ取得</Link>
            </h3>
          </div>
        </div> */}
      </Layout>
    </div>
  )
}
