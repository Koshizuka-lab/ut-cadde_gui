import React from 'react'
import Distribution from './Distribution'

export default function DistributionTable(props) {
    const headers_immed = (
        <tr>
            <th>配信名</th>
            <th>データ形式</th>
            <th>最終更新日</th>
            <th></th>
            <th></th>
        </tr>
    )
    const headers_period = (
        <tr>
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
                {props.distributions.map((distribution) => (<Distribution tag={props.tag} distribution={distribution}/>))}
            </tbody>
        </table>
    )
}