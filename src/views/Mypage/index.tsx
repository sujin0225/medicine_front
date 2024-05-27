import React, { useState } from 'react'
import'./style.css';
import MypageNavigate from 'components/MyPage_navigate';
import { useNavigate, useLocation, useParams } from 'react-router-dom'

export default function Mypage() {
  const { userId } = useParams();

  return (
    <div id='mypage-wrapper'>
      <div className='mypage-container'>
        <div className='mypage-contents-box'>
          <div className='mypage-navigate-box'>
            <div className='mypage-navigate-box-id'>안녕하세요, {userId}님!</div>
            <MypageNavigate/> 
          </div>
        </div>
      </div>
    </div>
  )
}
