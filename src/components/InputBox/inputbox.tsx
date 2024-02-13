import { ChangeEvent, KeyboardEvent, forwardRef } from 'react';
import './InputBox.css';

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
  isSignUp?: boolean;
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
  const { placeholder, type, value, isErrorMessage, buttonTitle, message, onChange, onKeydown, onButtonClick, isSignUp } = props;

  const buttonClass = value === '' ? 'input-box-button-disable' : 'input-box-button';
  // const messageClass = isErrorMessage ? 'input-box-message-error' : 'input-box-message';
  const messageClass = isErrorMessage ? (isSignUp ? 'input-box-message-error' : 'input-box-message-error-login') : (isSignUp ? 'input-box-message' : 'input-box-message-login');

  
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
