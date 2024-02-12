import { useState } from 'react'
import './Header.css'
import { useNavigate, useParams } from 'react-router-dom'
import { MAIN_PATH, SIGN_IN_PATH, SIGN_UP_PATH, USER_PATH, MEDICINE_SEARCH_PATH } from 'constant'
import { useLoginUserStore } from 'stores'
import { useCookies } from 'react-cookie';

export default function Header() {
//state: 로그인 상태
const [isLogin, setLogin] = useState<boolean>(false);   

//state: cookie 상태
const [cookies, setCookies] = useCookies();

//state: 로그인 유저 상태
const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

    //function: 네비게이트 함수
const navigate = useNavigate();

//event handler: 로고 클릭 이벤트 처리 함수 
const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
}

//event handler: 회원가입 클릭 이벤트 처리 함수 
const signupClickHandler = () => {
    navigate(SIGN_UP_PATH());
}

//event handler: 의약품 검색 버튼 클릭 이벤트 처리 함수
const onMedicineSearchClickHandler = () => {
    navigate(MEDICINE_SEARCH_PATH());
};

//component: 마이페이지 버튼 컴포넌트
const MyPageButton = () => {

//state: userEmail path variable 상태
const { user_id } = useParams();

//event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
const onMyPageButtonClickHandler = () => {
    if(!loginUser) return;
    const { user_id } = loginUser;
    navigate(USER_PATH(user_id));
};

//event handler: 마이페이지 버튼 클릭 이벤트 처리
const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    navigate(MAIN_PATH());
};

//event handler: 로그인 버튼 클릭 이벤트 처리 함수
const onSignInButtonClickHandler = () => {
    navigate(SIGN_IN_PATH());
};

//render: 마이페이지 버튼 컴포넌트 렌더링
if(isLogin && user_id === loginUser?.user_id)
return <div className='header-user' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>
//render: 로그아웃 버튼 컴포넌트 렌더링
if (isLogin)
return <div className='header-user' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
//render: 로그인 버튼 컴포넌트 렌더링
return <div className='header-user' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
};

  return (
    <div id='header'>
        <div className='header-container'>
            <div className='header-content-box'>
                <div className='header-logo' onClick={onLogoClickHandler}>{'이게머약?'}</div>
                    <div className='header-content' onClick={onMedicineSearchClickHandler}>{'의약품검색'}</div>
                    <div className='header-content'>{'상비약판매처'}</div>
                </div>
                <div className='header-right-box'>
                    <div className='header-user-box'>
                    <div className='header-user'><MyPageButton /></div>
                    <div className='header-user' onClick={signupClickHandler}>{'회원가입'}</div>
                </div>
            </div>
        </div>
    </div>
  )
}
