import React, { useState, useEffect } from 'react'
import DistributionTable from '../DistributionTable'



function Provider(props) {
    const [isExpanded, setIsExpanded] = useState(false)

    let provider = props.provider

    const doAction = ((e) => {
        e.preventDefault()
        let is_expanded = isExpanded
        is_expanded = !is_expanded
        setIsExpanded(is_expanded)
        console.log("isExpanded", isExpanded)
    })

    return (
        <div className='card my-3'>
            <div className='card-header'>
                <div className='row'>
                    <div className='col-3'>
                    <form onSubmit={doAction} action="">
                        {!isExpanded && <input type="submit" className="btn btn-secondary btn" value="配信を表示"/>}
                        {isExpanded && <input type="submit" className="btn btn-secondary btn" value="閉じる"/>}
                    </form>
                    </div>
                    <div className='col-8 h3'>
                        {provider["name"]}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className='card-body'>
                    <DistributionTable tag={props.tag} distributions={provider["distributions"]}/>
                </div>
            )}
        </div>
    )
}

export default Provider