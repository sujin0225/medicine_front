import { useState, useEffect } from 'react'
import './Header.css'
import { useNavigate, useParams } from 'react-router-dom'
import { MAIN_PATH, SIGN_IN_PATH, SIGN_UP_PATH, USER_PATH, MEDICINE_SEARCH_PATH, MEDICINE_STORE_PATH } from 'constant'
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

//event handler: 상비약 판매처 버튼 클릭 이벤트 처리 함수
const onMedicineStoreClickHandler = () => {
    navigate(MEDICINE_STORE_PATH());
};

//event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
const onMyPageButtonClickHandler = () => {
    if(!loginUser) return;
    const { userId } = loginUser;
    navigate(USER_PATH(userId));
};

//event handler: 로그아웃 버튼 클릭 이벤트 처리
const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() })
    navigate(MAIN_PATH());
};

//event handler: 로그인 버튼 클릭 이벤트 처리 함수
const onSignInButtonClickHandler = () => {
    navigate(SIGN_IN_PATH());
};

//토큰 상태
useEffect(() => {
    // 쿠키에 토큰이 있는지 확인
    const accessToken = cookies.accessToken;
    // 쿠키에 토큰이 있으면 로그인 상태를 true로 설정
    setLogin(accessToken !== undefined && accessToken !== '');
}, [cookies]);

//로그인 유저 상태
useEffect(() => {
    setLogin(loginUser !== null);
    console.log('loginUser 상태:', loginUser);
    console.log('로그인 여부:', loginUser !== null);
}, [loginUser])

  return (
    <div id='header'>
        <div className='header-container'>
            <div className='header-content-box'>
                <div className='header-logo' onClick={onLogoClickHandler}>{'이게머약?'}</div>
                    <div className='header-content' onClick={onMedicineSearchClickHandler}>{'의약품검색'}</div>
                    <div className='header-content' onClick={onMedicineStoreClickHandler}>{'상비약판매처'}</div>
                </div>
                <div className='header-right-box'>
                    <div className='header-user-box'>
                    {isLogin && (
            <>
              <div className='header-user' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
              <div className='header-user' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>
            </>
          )}
          {!isLogin && (
            <>
              <div className='header-user' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
              <div className='header-user' onClick={signupClickHandler}>{'회원가입'}</div>
            </>
                )}
                </div>
            </div>
        </div>
    </div>
  )
}
