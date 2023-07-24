import React from 'react'
import { Distribution } from "../types"

interface DistributionTableProps {
    distributions: Array<Distribution>
}

export default function DistributionTable(props: DistributionTableProps) {
    const headers = (
        <tr>
            <th>配信名</th>
            <th>提供者</th>
            <th>データ形式</th>
            <th>最終更新日</th>
            <th>説明</th>
            <th></th>
        </tr>
    )

    return (
        <table className="table table-striped">
            <thead>
                {headers}
            </thead>
            <tbody>
                {props.distributions}
            </tbody>
        </table>
    )
}