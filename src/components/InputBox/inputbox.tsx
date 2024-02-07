// import { ChangeEvent, KeyboardEvent, forwardRef } from 'react';
// import './Inputbox.css';

// interface Props {
//   title: string;
//   placeholder: string;
//   type: 'text' | 'password';
//   value: string;
//   message?: string;
//   isErrorMessage?: boolean;
//   buttonTitle?: string;
//   onChange: (event: ChangeEvent<HTMLInputElement>) => void;
//   onKeydown?: (event: KeyboardEvent<HTMLInputElement>) => void;
//   onButtonClick?:() => void;
// }

// const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

//   const { placeholder, type, value, isErrorMessage, buttonTitle, message, onChange, onKeydown, onButtonClick } = props;

//   const buttonClass = value === '' ? 'input-box-button-disable' : 'input-box-button';
//   const messageClass = isErrorMessage ? 'input-box-message-error' : 'input-box-message';

//   return(
//     <div className='input-box'>
//       <div className='input-box-content'>
//       <div className='input-box-body'>
//       <input ref={ref} className='input-box-input' placeholder={placeholder} type={type} value={value} onChange={onChange} onKeyDown={onKeydown}/>
//         {buttonTitle !== undefined && onButtonClick !== undefined && <div className={buttonClass} onClick={onButtonClick}>{buttonTitle}</div>}
//         </div>
//         {message !== undefined && <div className={messageClass}>{message}</div>}
//         </div>
//     </div>
//   )
// })

// export default InputBox;

import { ChangeEvent, KeyboardEvent, forwardRef } from 'react';
import './Inputbox.css';

interface Props {
  title: string;
  placeholder: string;
  type: 'text' | 'password';
  value: string;
  message?: string;
  isErrorMessage?: boolean;
  buttonTitle?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeydown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onButtonClick?:() => void;
  isSignUp?: boolean; // 추가: 회원가입 페이지 여부
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  const { placeholder, type, value, isErrorMessage, buttonTitle, message, onChange, onKeydown, onButtonClick, isSignUp } = props;

  const buttonClass = value === '' ? 'input-box-button-disable' : 'input-box-button';
  const messageClass = isErrorMessage ? 'input-box-message-error' : 'input-box-message';
  
  // 페이지에 따라 다른 입력 상자 클래스 선택
  const inputBoxInputClass = isSignUp ? 'input-box-input' : 'input-box-login-input';
  const inputBoxContentClass = isSignUp ? 'input-box-content' : 'input-box-content-login';

  return(
    <div className='input-box'>
      <div className={inputBoxContentClass}>
        <div className='input-box-body'>
          <input ref={ref} className={inputBoxInputClass} placeholder={placeholder} type={type} value={value} onChange={onChange} onKeyDown={onKeydown}/>
          {buttonTitle !== undefined && onButtonClick !== undefined && <div className={buttonClass} onClick={onButtonClick}>{buttonTitle}</div>}
        </div>
        {message !== undefined && <div className={messageClass}>{message}</div>}
      </div>
    </div>
  )
})

export default InputBox;
