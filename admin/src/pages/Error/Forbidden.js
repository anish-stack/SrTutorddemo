import React from 'react'
import './forbidden.css'
const Forbidden = () => {
    return (
        <div className='body'>
            <div class="lock"></div>
            <div class="message">
                <h1>Access to this page is restricted</h1>
                <p>Please check with the site admin if you believe this is a mistake.</p>
            </div>
        </div>
    )
}

export default Forbidden