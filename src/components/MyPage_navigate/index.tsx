import React from 'react'
import './style.css'
import { useLoginUserStore } from 'stores'
import { useCookies } from 'react-cookie';
import { MAIN_PATH } from 'constant'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

export default function MypageNavigate() {
//state: 로그인 유저 상태
const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

//state: cookie 상태
const [cookies, setCookies] = useCookies();
const userId = loginUser?.userId;
const location = useLocation();
const isUserPage = location.pathname === `/user/${userId}`;

//function: 네비게이트 함수
const navigate = useNavigate();

//event handler: 로그아웃 버튼 클릭 이벤트 처리
const onSignOutButtonClickHandler = () => {
  resetLoginUser();
  setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
  navigate(MAIN_PATH());
};

  return (
    <div className='mypage-navigate-box'>
        <div className={isUserPage ? 'mypage-navigate-box-text-bold' : 'mypage-navigate-box-text'}>관심 의약품</div>
        <div className='mypage-navigate-box-text'>회원 정보 수정</div>
        <div className='mypage-navigate-box-text'>내가 작성한 리뷰</div>
        <div className='mypage-navigate-box-text' onClick={onSignOutButtonClickHandler}>로그아웃</div>
    </div>
  )
}
