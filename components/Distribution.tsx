import React from 'react'
import Download from './Download'
import { Distribution } from '../types'

interface DistributionProps {
    tag: string
    distribution: Distribution
}

function Distribution (props: DistributionProps) {
    let distribution = props.distribution

    if (props.tag == "immed") {
        return (
            <tr>
                <td>{distribution.title}</td>
                <td>{distribution.resource_name}</td>
                <td>{distribution.data_type}</td>
                <td>{distribution.updated_time}</td>
                <td>
                    <button className="btn btn-secondary btn">
                        <a href="example.com" target="_blank">契約内容</a>
                    </button>
                </td>
                <td><Download url="./data.json" resourceUrl="" resourceType="" pID="" token=""/></td>
            </tr>
        )
    } else if (props.tag == "period") {
        return (
            <tr>
                <td>{distribution.title}</td>
                <td>{distribution.data_type}</td>
                <td>{distribution.resource_name}</td>
            </tr>
        )
    }
    
}

export default Distribution