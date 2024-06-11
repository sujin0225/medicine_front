import { useRef, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useLoginUserStore } from 'stores'
import MypageNavigate from 'components/MyPage_navigate';
import InputBox from 'components/InputBox/inputbox';
import './style.css'
import { DeleteUserResponseDto, GetSignInUserResponseDto, PatchPasswordResponseDto, UpdateEmailCertificationResponseDto, UpdateEmailResponseDto } from 'apis/response/user';
import { useNavigate } from 'react-router-dom';
import { ResponseDto } from 'apis/response';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { deleteUserRequest, getSignInUserRequest, patchPasswordRequest, updateEmailCertificationRequest, updateEmailRequest } from 'apis';
import { Myalert } from 'components/alert';
import { MyalertCancle } from 'components/alert';
import { PatchPasswordRequestDto, UpdateEmailCertificationRequestDto, UpdateEmailRequestDto } from 'apis/request/user';
import { User } from 'types/interface';
import { ResponseBody } from 'types';
import { ResponseCode } from 'types/enums';

export default function UserUpdate() {

const { loginUser } = useLoginUserStore();
const userId = loginUser?.userId;  
const emailRef = useRef<HTMLInputElement | null>(null);
const passwordRef = useRef<HTMLInputElement | null>(null);
const [emailMessage, setEmailMessage] = useState<string>('');
const [message, setMessage] = useState<string>('');
const [passwordMessage, setPasswordMessage] = useState<string>('');
const [isPasswordCheckError, setPasswordCheckeError] = useState<boolean>(false);
const [id,setId] = useState<string>('');
const [password,setPassword] = useState<string>('');
const [email,setEmail] = useState<string>('');
const [isEmailError, setEmailError] = useState<boolean>(false);
const [isPasswordError, setPasswordError] = useState<boolean>(false);
const [passwordCheck,setPasswordCheck] = useState<string>('');
const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
const [showEmail, setShowEmail] = useState<boolean>(false);
const [userInfo, setUserInfo] = useState<User>({} as User);
const passwordCheckRef = useRef<HTMLInputElement | null>(null);
const [showPasswordCheck, setShowPasswordCheck] = useState(false);
const certificationNumberRef = useRef<HTMLInputElement | null>(null);
const [certificationNumber,setCertificationNumber] = useState<string>('');
const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);
const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');
const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);
// const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/; 
const emailPattern = /^[a-zA-Z0-9._-]+@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\[{\]};:'",<.>/?])[a-zA-Z0-9!@#$%^&*()\-_=+\[{\]};:'",<.>/?]{8,12}$/;

//function: 네비게이트 함수
const navigate = useNavigate();

//state:쿠키 상태
const[cookies, setCookies] = useCookies();

//state: 로그인 유저 상태
const { resetLoginUser } = useLoginUserStore();

//이메일 변경 event handler
const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setEmail(value);
  setEmailMessage('');
};

//이메일 변경시 이메일 전송 버튼 클릭 event handler
const onSendEmailButtonClickHandler = () => {
  if (!loginUser || !cookies.accessToken || !email) return;
  
  const checkedEmail = emailPattern.test(email);
  if (!checkedEmail) {
      setEmailError(true);
      setEmailMessage('이메일 형식이 아닙니다.');
      return;
  }

  const requestBody: UpdateEmailCertificationRequestDto = { id: loginUser.userId, email };
  updateEmailCertificationRequest(requestBody).then(updateEmailCertificationResponse);

  setEmailError(false);
  setEmailMessage('이메일 전송중...');
}

//이메일 변경 event handler
const onUpdateEmailButtonClickHandler = () => {
  if (!loginUser || !cookies.accessToken || !email || !certificationNumber) return;
  const requestBody: UpdateEmailRequestDto = { id: loginUser.userId, email, certificationNumber };
  console.log(requestBody)
  updateEmailRequest(requestBody, cookies.accessToken).then(updateEmailResponse);
      
  setEmail('');
  setCertificationNumber('');
  setEmailMessage('');
  setCertificationNumberMessage('');
}

const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onEmailButtonClickHandler();
}

//비밀번호 변경 event handler 
const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setPassword(value);
  // 비밀번호 입력 시 비밀번호 확인 입력창 표시
  setShowPasswordCheck(value.length > 0);
};

const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  if (!passwordCheckRef.current) return;
  passwordCheckRef.current.focus();
}

//비밀번호 수정 클릭 이벤트 처리 event handler
const onPasswordButtonClickHandler = () => {
  if (!loginUser || !cookies.accessToken) return;
  const passwordCheck = passwordPattern.test(password);
  if(!passwordCheck) {
    setPasswordError(true);
    setPasswordMessage('비밀번호 형식이 아닙니다.');
    return;
}
  const requestBody: PatchPasswordRequestDto = { password }
  patchPasswordRequest(requestBody, cookies.accessToken).then(patchPasswordResponse);
}

//삭제 버튼 클릭 이벤트 처리 event handler
const onDeleteButtonClickHandler = () => {
  if (!loginUser || !cookies.accessToken) return;
  MyalertCancle("warning", "회원탈퇴 안내", "회원탈퇴 하시면, 이게머약?과 함께한 모든 데이터가 삭제됩니다. 그래도 정말로 탈퇴하시겠습니까?", "취소", "확인")
    .then((result) => {
      if (result.isConfirmed) {
        deleteUserRequest(cookies.accessToken).then(deleteUserResponse);
      }
    });
}

const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setPasswordCheck(value);
  setPasswordCheckMessage('');
};

//이메일 변경 버튼 클릭 이벤트 처리
const onEmailButtonClickHandler = () => {
  setShowEmail(!showEmail);
}

const onCertificationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setCertificationNumber(value);
  setCertificationNumberMessage('');
};

  //이메일 인증
  const updateEmailCertificationResponse = (responseBody: ResponseBody<UpdateEmailCertificationResponseDto>) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === ResponseCode.MAIL_FAIL) alert('이메일 전송에 실패했습니다.');
    if(code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if(code !== ResponseCode.SUCCESS) return;

    setEmailError(false);
    setEmailMessage('인증번호가 전송되었습니다.');

};

//인증번호 버튼 클릭 이벤트
const onCertificationNumberButtonClickHandler = () => {
  if(!id || !email || !certificationNumber) return;
  const requestBody: UpdateEmailRequestDto = { id, email, certificationNumber }
  updateEmailCertificationRequest(requestBody).then(updateEmailResponse);
};

const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onCertificationNumberButtonClickHandler();
}

//인증 번호 확인
const updateEmailResponse = (responseBody: ResponseBody<UpdateEmailResponseDto>) => {
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
  setCertificationCheck(true);
  Myalert("success", "이메일 변경", "이메일 변경이 완료되었습니다.", "확인");
  getSignInUserRequest(validUserId, cookies.accessToken).then(getSignInUserResponse);
};

//delete user response 처리 함수
const deleteUserResponse = async (responseBody: DeleteUserResponseDto | ResponseDto | null) => {
  if (!responseBody) return;
  const { code } = responseBody;
  
  if (code === 'VF') 
    alert('잘못된 접근입니다.');
  if (code === 'DBE') 
    alert('데이터베이스 오류입니다.');
  if (code !== 'SU') 
    alert('회원 탈퇴에 실패했습니다.');
  if (code === 'SU')
    Myalert("success", "회원탈퇴 안내", "탈퇴 처리 되었습니다. 이용해 주셔서 감사합니다.", "확인");
  resetLoginUser();
  setCookies('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
  navigate(MAIN_PATH());
}

//patch password response 처리 함수
const patchPasswordResponse = async (responseBody: PatchPasswordResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;

  if(code === 'VF') alert('잘못된 접근입니다.');
  if(code === 'NU') alert('존재하지 않는 유저입니다.');
  if(code === 'AF') alert('인증에 실패했습니다.');
  if(code === 'DBE') alert('데이터베이스 오류입니다.');
  if(code !== 'SU') return;
  if(code === 'SU')
    Myalert("success", "비밀번호 변경", "비밀번호 변경이 완료되었습니다.", "확인");
}

//get user response 처리 함수
const getSignInUserResponse = async (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
  const userInfo: User = { ...responseBody as GetSignInUserResponseDto};
  // console.log(userId, email);
  setUserInfo(userInfo);
  console.log(userInfo)
}

const validUserId = userId ?? "defaultUserId";

useEffect(() => {
  getSignInUserRequest(validUserId, cookies.accessToken).then(getSignInUserResponse);
}, [cookies.accessToken]);

return (
<div id='mypage-wrapper'>
  <div className='mypage-container'>
    <div className='mypage-contents-box'>
      <div className='mypage-navigate-box'>
        <div className='mypage-navigate-box-id'>안녕하세요, {userId}님!</div>
        <MypageNavigate/> 
      </div>
      <div className='mypage-contents-detail'>
        <div className='mypage-contents-box-text'>회원 정보 수정</div>
        <div id='mypage-update-wrapper'>
          <div className='mypage-update-content-box-border'>
            <div className='mypage-update-content-box-in'>
            <div className='mypage-update-content-text'>이메일</div>
            <div className='mypage-input-button-box'>
              <div className='mypage-email-input'>{userInfo.email}</div>
              <div className='button' onClick={onEmailButtonClickHandler}>
              {
                showEmail ? <div className='mypage-email-button'>이메일 변경</div> : <div className='mypage-email-button-disable'>이메일 변경</div>
              }
              </div>
            </div>
            {
                showEmail && 
                <>
                <InputBox ref={emailRef} title='이메일' placeholder='변경할 이메일을 입력해주세요.' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle='이메일 전송' isMypage={true} onButtonClick={onSendEmailButtonClickHandler} onKeydown={onEmailKeyDownHandler}/>
                <InputBox ref={certificationNumberRef} title='인증번호' placeholder='인증번호 4자리를 입력해주세요' type='text' value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} isMypage={true} message={certificationNumberMessage} onKeydown={onCertificationNumberKeyDownHandler}/>
                <div className='primary-button-lg full-width' onClick={onUpdateEmailButtonClickHandler}>수정완료</div>
                </>
              }
            <div className='mypage-update-content-text'>비밀번호</div>
            <InputBox ref={passwordRef} title='비밀번호' placeholder='변경할 비밀번호를 입력해 주세요.' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} isMypage={true} onKeydown={onPasswordKeyDownHandler}/>
            {showPasswordCheck && (
            <>
            <InputBox ref={passwordCheckRef} title='비밀번호 확인' placeholder='비밀번호 확인' type='password' value={passwordCheck} onChange={onPasswordCheckChangeHandler} isMypage={true} />
            <div className='primary-button-lg full-width' onClick={onPasswordButtonClickHandler}>수정완료</div>
            </>
            )}
            <div className='mypage-update-content-text-delete' onClick={onDeleteButtonClickHandler}>회원 탈퇴하기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}