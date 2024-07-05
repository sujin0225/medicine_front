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
    const { item_IMAGE, item_NAME, entp_NAME, etc_OTC_NAME, form_CODE_NAME, item_SEQ } = medicineListItem;
     //function: 네비게이트 함수 
     const navigate = useNavigate();
     //event handler: 의약품 클릭 이벤트 처리 함수 
     const onClickHandler = () => {
         navigate(MEDICINE_DETAIL_PATH(item_SEQ));
     }
    return (
        <div className='medicine-list-item' onClick={onClickHandler}>
            <div className='medicine-list-item-image' style={{ backgroundImage: `url(${item_IMAGE})` }}></div>
            <div className='medicine-list-item-name'>{item_NAME}</div>
            {/* <div className='medicine-list-item-content'>{CLASS_NAME}</div> */}
            <div className='medicine-list-item-content-bottom'>{form_CODE_NAME}</div>
            <div className='medicine-list-item-content-bottom'>{entp_NAME}</div>
            <div className={`medicine-list-item-content-${etc_OTC_NAME === '일반의약품' ? 'ETC-Gold' : 'ETC-Red'}`}>{etc_OTC_NAME}</div>
        </div>
    )
}
