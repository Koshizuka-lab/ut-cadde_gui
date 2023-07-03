import React, { useState } from 'react'
import Download from './Download'

function Distribution (props) {
    let distribution = props.distribution

    if (props.tag == "immed") {
        return (
            <tr>
                <td>{distribution.name}</td>
                <td>{distribution.data_type}</td>
                <td>{distribution.updated_time}</td>
                <td>
                    <button className="btn btn-secondary btn">
                        <a href="example.com" target="_blank">契約内容</a>
                    </button>
                </td>
                <td><Download test={true}/></td>
            </tr>
        )
    } else if (props.tag == "period") {
        return (
            <tr>
                <td>{distribution.name}</td>
                <td>{distribution.data_type}</td>
                <td>
                    <input type="text" value={distribution.transfer_url}></input>
                </td>
                <td>{distribution.often}</td>
            </tr>
        )
    }
    
}

export default Distribution