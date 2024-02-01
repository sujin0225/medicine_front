import React from 'react'
import './Header.css'

export default function Header() {
  return (
    <div id='header'>
        <div className='header-container'>
            <div className='header-content-box'>
                <div className='header-logo'>{'이게머약?'}</div>
                    <div className='header-content'>{'의약품검색'}</div>
                    <div className='header-content'>{'상비약판매처'}</div>
                </div>
                <div className='header-right-box'>
                    <div className='header-user-box'>
                    <div className='header-user'>{'로그인'}</div>
                    <div className='header-user'>{'회원가입'}</div>
                </div>
            </div>
        </div>
    </div>
  )
}
