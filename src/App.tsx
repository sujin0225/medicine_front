import './App.css';
import Main from 'views/Authentication/Main';
import Container from 'layouts/container/container';
import OAuth from 'views/Authentication/OAuth';
import { ChangeEvent, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from 'views/Authentication/signup/signup';
import SignIn from 'views/Authentication/signin/signin';
import { SIGN_IN_PATH } from 'constant';
import { SIGN_UP_PATH } from 'constant';
import { MEDICINE_SEARCH_PATH } from 'constant';
import { MAIN_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { useEffect } from 'react';
import MedicineSearch from 'views/Authentication/MedicineSearch';

function App() {

  //state: 로그인 유저 전역 상태
  const { setLoginUser, resetLoginUser } = useLoginUserStore();


  const [id, setId] = useState<string>('');


  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={MEDICINE_SEARCH_PATH()} element={<MedicineSearch /> } />
        <Route path={SIGN_IN_PATH()} element={<SignIn />} />
        <Route path={SIGN_UP_PATH()} element={<SignUp />} />
        <Route path='oauth-response/:token/:expirationTime' element={<OAuth/>} />
      </Route>
    </Routes>
  );
}

export default App;
