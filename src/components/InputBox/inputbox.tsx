import React, { forwardRef } from 'react'
import './Inputbox.css';

interface Props {

}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

  return(
    <div className='input-box'>
      <input className='input-box-input'></input>
    </div>
  )
})

export default InputBox;