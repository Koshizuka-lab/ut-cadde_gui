import React from 'react'
import { Distribution } from "../types"


export default function DistributionTable(props) {
    const headers = (
        <tr>
            <th>Distribution Title</th>
            <th>Provider</th>
            <th>Data Type</th>
            <th>Last Updated Time</th>
            <th>Description</th>
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