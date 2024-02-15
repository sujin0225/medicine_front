import React from 'react'
import './MedicineItem.css'
import { MedicineListItem } from 'types/interface'
import { useNavigate } from 'react-router-dom';
import { MEDICINE_DETAIL_PATH } from 'constant';

interface Props {
    medicineListItem: MedicineListItem
}

export default function MedicineItem({ medicineListItem }: Props) {

    //medicineListItem 컴포넌트 렌더링
    const { ITEM_IMAGE, ITEM_NAME, CLASS_NAME, ENTP_NAME, ETC_OTC_NAME, FORM_CODE_NAME, ITEM_SEQ } = medicineListItem;

     //function: 네비게이트 함수 
     const navigate = useNavigate();

     //event handler: 의약품 클릭 이벤트 처리 함수 
     const onClickHandler = () => {
         // navigate(boardNumber);
         navigate(MEDICINE_DETAIL_PATH(ITEM_SEQ));
         // navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
     }

    return (
        <div className='medicine-list-item' onClick={onClickHandler}>
            <div className='medicine-list-item-image' style={{ backgroundImage: `url(${ITEM_IMAGE})` }}></div>
            <div className='medicine-list-item-name'>{ITEM_NAME}</div>
            <div className='medicine-list-item-content'>{CLASS_NAME}</div>
            <div className='medicine-list-item-content-bottom'>{FORM_CODE_NAME}</div>
            <div className='medicine-list-item-content-bottom'>{ENTP_NAME}</div>
            <div className={`medicine-list-item-content-${ETC_OTC_NAME === '일반의약품' ? 'ETC-Gold' : 'ETC-Red'}`}>{ETC_OTC_NAME}</div>
        </div>
    )
}
