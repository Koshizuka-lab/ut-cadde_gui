import React, { useState } from 'react'
import styles from "../styles/Home.module.css"

function Settings(props) {

    const doChangeHost = ((e) => {
        props.setHostname(e.target.value)
    })
    const doChangePort = ((e) => {
        props.setPort(e.target.value)
    })

    return (
        <div className={styles.card}>
            <h2>設定</h2>
            <div className='container'>
                <form>
                    <div className='form-row'>
                        <div className='form-group mr-1 col-5'>
                            <label clasName="form-label">利用者コネクタのhostname</label>
                            <input type="text" className='form-control' onChange={doChangeHost} placeholder=""/>    
                        </div>
                        <div className='form-group mr-1 col-5'>
                        <label clasName="form-label">利用者コネクタのport番号</label>
                            <input type="text" className='form-control' onChange={doChangePort} placeholder=""/>
                        </div>
                    </div>
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={props.test}
                            onChange={() => props.setTest(prevState => !prevState)} 
                        />
                        <label className="form-check-label">test</label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Settings