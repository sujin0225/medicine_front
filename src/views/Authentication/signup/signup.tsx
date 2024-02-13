import InputBox from 'components/InputBox/inputbox';
import { KeyboardEvent, ChangeEvent, useRef, useState } from 'react';
import './signup.css'
import { useNavigate } from 'react-router-dom';
import { idCheckRequestDto, EmailCertificationRequestDto, CheckCertificationRequestDto, SignUpRequestDto } from 'apis/request/auth';
import { idCheckRequest, emailCertificationRequest, checkCertificationRequest, signUpRequest, SNS_SIGN_IN_URL } from 'apis';
import { IdCheckResponseDto, EmailCertificationResponseDto, CheckCertificationResponseDto, SignUpResponseDto } from 'apis/response/auth';
import { ResponseDto } from 'apis/response';
import { ResponseCode } from 'types/enums';
import { ResponseBody } from 'types';

export default function SignIn() {

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

  const [isIdCheck, setIdCheck] = useState<boolean>(false);
  const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;  
  const idPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,12}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\[{\]};:'",<.>/?])[a-zA-Z0-9!@#$%^&*()\-_=+\[{\]};:'",<.>/?]{8,12}$/;

  const navigate = useNavigate();  

  //아이디 중복 확인
  const idCheckResponse = (responseBody: IdCheckResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
        const { code } = responseBody;
        if(code === ResponseCode.VALIDATION_FAIL) alert('아이디를 입력하세요.');
        if(code === ResponseCode.DUPLICATE_ID) {
            setIdError(true);
            setIdMessage('이미 사용중인 아이디 입니다.');
            setIdCheck(false);
        }
        if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
        if(code !== ResponseCode.SUCCESS) return;

        const checkedId = idPattern.test(id);
        if(!checkedId) {
            setIdError(true);
            setIdMessage('영문/숫자 조합으로 8 - 12자리로만 가능합니다.');
            return;
        }
        
        setIdError(false);
        setIdMessage('사용 가능한 아이디 입니다.');
        setIdCheck(true);
  };

  //이메일 인증
  const emailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponseDto>) => {
    if(!responseBody) return;
    const { code } = responseBody;

    if(code === ResponseCode.VALIDATION_FAIL) alert('아이디와 이메일을 모두 입력하세요.');
    if(code === ResponseCode.DUPLICATE_ID) {
        setIdError(true);
        setIdMessage('이미 사용중인 아이디 입니다.');
        setIdCheck(false);
    }
    if(code === ResponseCode.MAIL_FAIL) alert('이메일 전송에 실패했습니다.');
    if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if(code !== ResponseCode.SUCCESS) return;

    setEmailError(false);
    setEmailMessage('인증번호가 전송되었습니다.');
};

//인증 번호 확인
const checkCertificationResponse = (responseBody: ResponseBody<CheckCertificationResponseDto>) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if(code === ResponseCode.VALIDATION_FAIL) alert('아이디, 이메일, 인증번호를 모두 입력하세요.');
  if(code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
  }
  if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
  if(code !== ResponseCode.SUCCESS) return;

  setCertificationNumberError(false);
  setCertificationNumberMessage('인증번호가 확인되었습니다.');
  setCertificationCheck(true);
};

//회원가입
const signUpResponse = (responseBody: ResponseBody<SignUpResponseDto>) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if(code === ResponseCode.VALIDATION_FAIL) alert('모든 값을 입력하세요.');
  if(code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
  }
  if(code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
  }
  if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
  if(code !== ResponseCode.SUCCESS) return;

  if (code === ResponseCode.SUCCESS) {
    alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
    navigate('/auth/sign-in');
  }
};

const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setId(value);
  setIdMessage('');
  setIdCheck(false);
};

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage('');
  };

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setPasswordCheckMessage('');
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
    if(!id) return;
    const requestBody: idCheckRequestDto ={ id };
    idCheckRequest(requestBody).then(idCheckResponse);
  };

  const onEmailButtonClickHandler = () => {
    if(!id || !email) return;
    const checkedEmail = emailPattern.test(email);
    if(!checkedEmail) {
        setEmailError(true);
        setEmailMessage('이메일 형식이 아닙니다.');
        return;
    }

    const requestBody: EmailCertificationRequestDto = { id, email };
    emailCertificationRequest(requestBody).then(emailCertificationResponse);

    setEmailError(false);
    setEmailMessage('이메일 전송중...');
};

const onCertificationNumberButtonClickHandler = () => {
  if(!id || !email || !certificationNumber) return;
  const requestBody: CheckCertificationRequestDto = { id, email, certificationNumber }
  checkCertificationRequest(requestBody).then(checkCertificationResponse);
};

const onSignUpButtonClickHandler = () => {
  if(!id || !password || !passwordCheck || !email || !certificationNumber) return;
  if(!isIdCheck) {
      alert('중복 확인은 필수입니다.');
      return;
  }
  const checkedPassword = passwordPattern.test(password);
  if(!checkedPassword) {
      setPasswordError(true);
      setPasswordMessage('영문/숫자/특수문자를 사용하여 8 - 12자리로만 가능합니다.');
      return;
  }
  if(password !== passwordCheck) {
      setPasswordCheckeError(true);
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
      return;
  }
  if (!isCertificationCheck) {
      alert('이메일 인증은 필수입니다.');
      return;
  }

  const requestBody: SignUpRequestDto = { id, password, email, certificationNumber};
  signUpRequest(requestBody).then(signUpResponse);
};

const onSnsSignInButtonClickHandler = (type: 'kakao' | 'naver') => {
  window.location.href = SNS_SIGN_IN_URL(type);
}

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
          <InputBox ref={idRef} title='아이디' placeholder='아이디' type='text' value={id} onChange={onIdChangeHandler} isErrorMessage={isIdError} message={idMessage} buttonTitle='중복 확인' onButtonClick={onIdButtonClickHandler} isSignUp={true} onKeydown={onIdKeyDownHandler}/>
          <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} isSignUp={true} onKeydown={onPasswordKeyDownHandler}/>
          <InputBox ref={passwordCheckRef} title='비밀번호 확인' placeholder='비밀번호 확인' type='password' value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} isSignUp={true} onKeydown={onPasswordCheckKeyDownHandler}/>
          <InputBox ref={emailRef} title='이메일' placeholder='이메일' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle='인증메일 발송' onButtonClick={onEmailButtonClickHandler} isSignUp={true} onKeydown={onEmailKeyDownHandler}/>
          <InputBox ref={certificationNumberRef} title='인증번호' placeholder='인증번호 4자리를 입력해주세요' type='text' value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} message={certificationNumberMessage} buttonTitle='인증 확인' onButtonClick={onCertificationNumberButtonClickHandler} isSignUp={true} onKeydown={onCertificationNumberKeyDownHandler}/>
          <div className='primary-button-lg full-width' onClick={onSignUpButtonClickHandler}>회원가입</div>
          <div className='sns-text-box'>
            <div className='sns-line'></div>
            <div className='sns-text'>SNS 계정으로 회원가입</div>
            <div className='sns-line'></div>
          </div>
          <div className='sns-button-box'>
            <div className='kakao-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('kakao')}>KAKAO로 회원가입</div>
            <div className='naver-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('naver')}>NAVER로 회원가입</div>
          </div>
        </div>
      </div>
    </div>
  )
}
