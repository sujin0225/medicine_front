import InputBox from 'components/InputBox/inputbox';
import { KeyboardEvent, ChangeEvent, useRef, useState } from 'react';
import './signin.css'
import { useNavigate } from 'react-router-dom';
import { SNS_SIGN_IN_URL } from 'apis';
import { ResponseCode } from 'types/enums';
import { ResponseBody } from 'types';

export default function SignUp() {

  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const[id,setId] = useState<string>('');
  const[password,setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate(); 

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
    setMessage('');
};

const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if(event.key !== 'Enter') return;
  if(!passwordRef.current) return;
  passwordRef.current.focus();
};

const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setPassword(value);
  setMessage('');
};

const onSignUpButtonClickHandler = () => {
  navigate('/auth/signup');
};

const onSnsSignInButtonClickHandler = (type: 'kakao' | 'naver') => {
  window.location.href = SNS_SIGN_IN_URL(type);
}

const onSignInButtonClickHandler = () => {

  if(!id || !password) {
      alert('아이디와 비밀번호 모두 입력하세요.');
      return;
  }

  // const requestBody: SignInRequestDto = { id, password };
  // signInRequest(requestBody).then(signInResponse);
};

const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if(event.key !== 'Enter') return;
  onSignInButtonClickHandler();
};
  
  return (
    <div id='sign-in'>
      <div className='sign-in-container'>
        <div className='sign-in-box'>
          <div className='sign-in-text-box'>
            <div className='sign-in-text'>{'의약품이 궁금할 땐,'}</div>
            <div className='sign-in-text'>{'이게머약? 에서 검색하세요!'}</div>
          </div>
          <InputBox ref={idRef} title='아이디' placeholder='아이디' type='text' value={id} onChange={onIdChangeHandler} onKeydown={onIdKeyDownHandler}/>
          <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage message={message} onKeydown={onPasswordKeyDownHandler}/>
          <div className='primary-button-lg full-width' onClick={onSignUpButtonClickHandler}>로그인</div>
          <div className='sign-button-lg full-width' onClick={onSignUpButtonClickHandler}>회원가입</div>
          <div className='sns-text-box'>
            <div className='sns-line'></div>
            <div className='sns-text'>SNS 계정으로 로그인</div>
            <div className='sns-line'></div>
          </div>
          <div className='sns-button-box'>
            <div className='kakao-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('kakao')}>KAKAO로 로그인</div>
            <div className='naver-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('naver')}>NAVER로 로그인</div>
          </div>
        </div>
      </div>
    </div>
  )
}
