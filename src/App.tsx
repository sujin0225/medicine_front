import './App.css';
import InputBox from 'components/InputBox/inputbox';
import Footer from 'layouts/Footer/Footer';
import Header from 'layouts/Header/Header';
import Container from 'layouts/container/container';
import { Route, Routes } from 'react-router-dom';
import SignUp from 'views/Authentication/signup/signup';

function App() {
  return (
    // <Routes>
    //   <Route element={<Container/>}>
    //   <Route path='/signup' element={<SignUp />} />
    //   </Route>
    // </Routes> 
    <>
      <InputBox />
    </>
  );
}

export default App;
