import './App.css';
import Main from 'views/Main';
import Container from 'layouts/container/container';
import OAuth from 'views/Authentication/OAuth';
import { ChangeEvent, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from 'views/Authentication/signup/signup';
import SignIn from 'views/Authentication/signin/signin';
import { SIGN_IN_PATH } from 'constant';
import { SIGN_UP_PATH } from 'constant';
import { MEDICINE_SEARCH_PATH } from 'constant';
import { MEDICINE_DETAIL_PATH } from 'constant';
import { SEARCH_PATH } from 'constant';
import { MAIN_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { useEffect } from 'react';
import MedicineSearch from 'views/MedicineSearch/Main';
import Search from 'views/Search';
import MedicineDetail from 'views/MedicineSearch/Detail';
import { useCookies } from 'react-cookie';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';
import { getSignInUserRequest } from 'apis';
import { useParams } from 'react-router-dom';

function App() {

  const { userId } = useParams();
  //state: 로그인 유저 전역 상태
  const { setLoginUser, resetLoginUser } = useLoginUserStore();
  //state: cookie 상태
  const [cookies, setCookie] = useCookies();
  //function: get sign in user response 처리 함수 
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto };
    setLoginUser(loginUser);
  }

  // //effect: accessToken cookie값이 변경될 때 마다 실행할 함수
  // useEffect(() => {
  //   if(!cookies.accessToken) {
  //       resetLoginUser();
  //       return;
  //   }
  //   getSignInUserRequest(userId, cookies.accessToken).then(getSignInUserResponse);
  // }, [cookies.accessToken]);
  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }

    //userId가 undefined일 수 있으므로 기본값 제공
    const validUserId = userId ?? "defaultUserId"; // "defaultUserId"는 선택한 기본값
    getSignInUserRequest(validUserId, cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken, userId]);


  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={MEDICINE_SEARCH_PATH()} element={<MedicineSearch /> } />
        <Route path={MEDICINE_DETAIL_PATH(':ITEM_SEQ')} element={<MedicineDetail />} />
        <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
        <Route path={SIGN_IN_PATH()} element={<SignIn />} />
        <Route path={SIGN_UP_PATH()} element={<SignUp />} />
        <Route path='oauth-response/:token/:expirationTime' element={<OAuth/>} />
      </Route>
    </Routes>
  );
}

export default App;
