import React from 'react'
import './style.css';
import { FavoriteMedicine } from 'types/interface';
import { useNavigate } from 'react-router-dom';
import { MEDICINE_DETAIL_PATH } from 'constant';

interface Props {
    FavoriteMedicine: FavoriteMedicine;
}

export default function Mymedicine({ FavoriteMedicine }: Props) {
    const { userId, itemSeq, write_datetime, form_CODE_NAME, item_NAME, class_NO, item_IMAGE, item_ENG_NAME} = FavoriteMedicine;
    const { entp_NAME, class_NAME, etc_OTC_NAME} = FavoriteMedicine;

    //function: 네비게이트 함수 
const navigate = useNavigate();

    //event handler: 의약품 클릭 이벤트 처리 함수 
    const onClickHandler = () => {
      // navigate(boardNumber);
      navigate(MEDICINE_DETAIL_PATH(itemSeq));
      // navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
  }

  return (
    <div className='mypage-mymedicine-container'>
  <div className='mypage-mymedicine-text-box' onClick={onClickHandler}>
    <div className='mypage-mymedicine-text-title'>{item_NAME}</div>
    <div className='mypage-mymedicine-text-content'>{form_CODE_NAME}</div>
    <div className='mypage-mymedicine-text-content'>{class_NAME}</div>
    <div className='mypage-mymedicine-text-content'>{entp_NAME}</div>
    <div className={`mypage-mymedicine-${etc_OTC_NAME === '일반의약품' ? 'gold' : 'red'}`}>{etc_OTC_NAME}</div>
  </div>
  <div className='mypage-mymedicine-image' style={{ backgroundImage: `url(${item_IMAGE})` }}></div>
</div>
  )
}