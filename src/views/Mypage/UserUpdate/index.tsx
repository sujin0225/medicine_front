import { useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import { useLoginUserStore } from 'stores'
import MypageNavigate from 'components/MyPage_navigate';
import InputBox from 'components/InputBox/inputbox';
import './style.css'
import { DeleteUserResponseDto } from 'apis/response/user';
import { useNavigate } from 'react-router-dom';
import { ResponseDto } from 'apis/response';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { deleteUserRequest } from 'apis';
import { Myalert } from 'components/alert';
import { MyalertCancle } from 'components/alert';

export default function UserUpdate() {

const { loginUser } = useLoginUserStore();
const userId = loginUser?.userId;  
const emailRef = useRef<HTMLInputElement | null>(null);
const passwordRef = useRef<HTMLInputElement | null>(null);
const [emailMessage, setEmailMessage] = useState<string>('');
const [message, setMessage] = useState<string>('');
const [passwordMessage, setPasswordMessage] = useState<string>('');

const[id,setId] = useState<string>('');
const[password,setPassword] = useState<string>('');
const[email,setEmail] = useState<string>('');
const [isEmailError, setEmailError] = useState<boolean>(false);
const [isPasswordError, setPasswordError] = useState<boolean>(false);

const passwordCheckRef = useRef<HTMLInputElement | null>(null);
const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/; 
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

//이메일 버튼 클릭 event handler
const onEmailButtonClickHandler = () => {
  if(!id || !email) return;
  const checkedEmail = emailPattern.test(email);
  if(!checkedEmail) {
      setEmailError(true);
      setEmailMessage('이메일 형식이 아닙니다.');
      return;
  }
}

//비밀번호 변경 버튼 클릭 event handler
const onPasswordClickHandler = () => {
  if(!id || !email) return;
  const passwordCheck = passwordPattern.test(password);
  if(!passwordCheck) {
      setEmailError(true);
      setEmailMessage('비밀번호 형식이 아닙니다.');
      return;
  }
}

const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onEmailButtonClickHandler();
}

//비밀번호 변경 event handler
const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setPassword(value);
  setMessage('');
};  

const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  if (!passwordCheckRef.current) return;
  passwordCheckRef.current.focus();
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
            <InputBox ref={emailRef} title='이메일' placeholder='이메일' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle='이메일 변경' isMypage={true} onButtonClick={onEmailButtonClickHandler} onKeydown={onEmailKeyDownHandler}/>
            <div className='mypage-update-content-text'>비밀번호</div>
            <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} buttonTitle='비밀번호 변경' isMypage={true} onButtonClick={onPasswordClickHandler} onKeydown={onPasswordKeyDownHandler}/>
            <div className='primary-button-lg full-width'>수정완료</div>
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