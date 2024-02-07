import './App.css';
import Container from 'layouts/container/container';
import OAuth from 'views/Authentication/OAuth';
import { ChangeEvent, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from 'views/Authentication/signup/signup';
import SignIn from 'views/Authentication/signin/signin';

function App() {

  const [id, setId] = useState<string>('');

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
  }

  const onIdButtonClickHandler = () => {

  }

  return (
    <Routes>
      <Route path='/auth' element={<Container />}>
        <Route path='signin' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='oauth-response/:token/:expirationTime' element={<OAuth/>} />
      </Route>
    </Routes>
  );
}

export default App;
