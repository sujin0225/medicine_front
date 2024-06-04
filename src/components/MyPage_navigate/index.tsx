import React from 'react'
import './style.css'
import { useLoginUserStore } from 'stores'
import { useCookies } from 'react-cookie';
import { MAIN_PATH, MY_REVIEW, USER_PATH, USER_UPDATE } from 'constant'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

export default function MypageNavigate() {
//state: 로그인 유저 상태
const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

//state: cookie 상태
const [cookies, setCookies] = useCookies();
const userId = loginUser?.userId;
const location = useLocation();
const isUserPage = location.pathname === `/user/${userId}`;
const isUserUpdate = location.pathname === `/user/update/${userId}`;
const isMyReview = location.pathname === `/user/review/${userId}`;

//function: 네비게이트 함수
const navigate = useNavigate();

//event handler: 로그아웃 버튼 클릭 이벤트 처리
const onSignOutButtonClickHandler = () => {
  resetLoginUser();
  setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
  navigate(MAIN_PATH());
};

//event handler: 내가 작성한 리뷰 클릭 이벤트 처리 함수
const onMyReviewClickHandler = () => {
  if(!loginUser) return;
  const { userId } = loginUser;
  navigate(MY_REVIEW(userId));
}

//event handler: 내가 작성한 리뷰 클릭 이벤트 처리 함수
const onFavoriteMedicineClickHandler = () => {
  if(!loginUser) return;
  const { userId } = loginUser;
  navigate(USER_PATH(userId));
}

//event handler: 내가 작성한 리뷰 클릭 이벤트 처리 함수
const onUserUpdateClickHandler = () => {
  if(!loginUser) return;
  const { userId } = loginUser;
  navigate(USER_UPDATE(userId));
}

  return (
    <div className='mypage-navigate-box'>
        <div className={isUserPage ? 'mypage-navigate-box-text-bold' : 'mypage-navigate-box-text'} onClick={onFavoriteMedicineClickHandler}>관심 의약품</div>
        <div className={isUserUpdate ? 'mypage-navigate-box-text-bold' : 'mypage-navigate-box-text'} onClick={onUserUpdateClickHandler}>회원 정보 수정</div>
        <div className={isMyReview ? 'mypage-navigate-box-text-bold' : 'mypage-navigate-box-text'} onClick={onMyReviewClickHandler}>내가 작성한 리뷰</div>
        <div className='mypage-navigate-box-text' onClick={onSignOutButtonClickHandler}>로그아웃</div>
    </div>
  )
}