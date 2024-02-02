import InputBox from 'components/InputBox/inputbox';
import { KeyboardEvent, ChangeEvent, useRef, useState } from 'react';
import './signup.css'

export default function SignUp() {

  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const certificationNumberRef = useRef<HTMLInputElement | null>(null);

  const[id,setId] = useState<string>('');
  const[password,setPassword] = useState<string>('');
  const[passwordCheck,setPasswordCheck] = useState<string>('');
  const[email,setEmail] = useState<string>('');
  const[certificationNumber,setCertificationNumber] = useState<string>('');

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckeError] = useState<boolean>(false);
  const [isEmailError, setEmailError] = useState<boolean>(false);
  const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
    setIdMessage('');
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage('');
  };

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setPasswordMessage('');
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage('');
  };

  const onCertificationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage('');
  };

  const onIdButtonClickHandler = () => {

  };

  const onEmailButtonClickHandler = () => {

  };

  const onCertificationNumberButtonClickHandler = () => {

  };

  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
   onIdButtonClickHandler();
  }

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  }

  const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!emailRef.current) return;
    emailRef.current.focus();
  }

  const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onEmailButtonClickHandler();
  }

  const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onCertificationNumberButtonClickHandler();
  }


  return (
    <div id='sign-up'>
      <div className='sign-up-container'>
        <div className='sign-up-box'>
          <div className='sign-up-text-box'>
            <div className='sign-up-text'>{'의약품이 궁금할 땐,'}</div>
            <div className='sign-up-text'>{'이게머약? 에서 검색하세요!'}</div>
          </div>
          <InputBox ref={idRef} title='아이디' placeholder='아이디' type='text' value={id} onChange={onIdChangeHandler} isErrorMessage={isIdError} message={idMessage} buttonTitle='중복 확인' onButtonClick={onIdButtonClickHandler} onKeydown={onIdKeyDownHandler}/>
          <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeydown={onPasswordKeyDownHandler}/>
          <InputBox ref={passwordCheckRef} title='비밀번호 확인' placeholder='비밀번호 확인' type='password' value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeydown={onPasswordCheckKeyDownHandler}/>
          <InputBox ref={emailRef} title='이메일' placeholder='이메일' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle='인증메일 발송' onButtonClick={onEmailButtonClickHandler} onKeydown={onEmailKeyDownHandler}/>
          <InputBox ref={certificationNumberRef} title='인증번호' placeholder='인증번호 4자리를 입력해주세요' type='text' value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} message={certificationNumberMessage} buttonTitle='인증 확인' onButtonClick={onCertificationNumberButtonClickHandler} onKeydown={onCertificationNumberKeyDownHandler}/>
          <div className='primary-button-lg full-width'>회원가입</div>
          <div className='sns-text-box'>
            <div className='sns-line'></div>
            <div className='sns-text'>SNS 계정으로 회원가입</div>
            <div className='sns-line'></div>
          </div>
          <div className='sns-button-box'>
            <div className='kakao-sign-in-button'>KAKAO로 회원가입</div>
            <div className='naver-sign-in-button'>NAVER로 회원가입</div>
          </div>
        </div>
      </div>
    </div>
  )
}
