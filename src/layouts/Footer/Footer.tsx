import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <div id='footer'>
        <div className='footer-container'>
            <div className='footer-top-box'>
                <div className='footer-logo'>{'이게머약?'}</div>
                    <div className='footer-text-box'>
                    <div className='footer-text'>{'이수진'}</div>
                    <div className='footer-text'>{'|'}</div>
                    <div className='footer-text'>{'suz225@naver.com'}</div>
                </div>
            </div>
            <div className='footer-bottom-box'>
                <div className='footer-copyright'>{'copyright ⓒ 이게머약? all right reserved.'}</div>
            </div>
        </div>
    </div>
  )
}
