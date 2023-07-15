import React from 'react'
import Distribution from './Distribution'

interface DistributionTableProps {
    tag: string
    distributions: any
}

export default function DistributionTable(props: DistributionTableProps) {
    const headers_immed = (
        <tr>
            <th>データセット名</th>
            <th>配信名</th>
            <th>データ形式</th>
            <th>最終更新日</th>
            <th></th>
            <th></th>
        </tr>
    )
    const headers_period = (
        <tr>
            <th>データセット名</th>
            <th>配信名</th>
            <th>データ形式</th>
            <th>転送先URL</th>
            <th>取得頻度</th>
        </tr>
    )

    return (
        <table className="table table-striped">
            <thead>
                {props.tag == "immed" && headers_immed}
                {props.tag == "period" && headers_period}
            </thead>
            <tbody>
                {props.distributions.map((distribution) => (<Distribution key="" tag={props.tag} distribution={distribution}/>))}
            </tbody>
        </table>
    )
}