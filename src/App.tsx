import './App.css';
import InputBox from 'components/InputBox/inputbox';
import Footer from 'layouts/Footer/Footer';
import Header from 'layouts/Header/Header';
import Container from 'layouts/container/container';
import { ChangeEvent, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUp from 'views/Authentication/signup/signup';

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
      <Route element={<Container/>}>
      <Route path='/signup' element={<SignUp />} />
      </Route>
    </Routes> 
  );
}

export default App;
