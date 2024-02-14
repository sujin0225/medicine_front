import React from 'react'
import './MedicineItem.css'
import { MedicineListItem } from 'types/interface'

interface Props {
    medicineListItem: MedicineListItem
}

export default function MedicineItem({ medicineListItem }: Props) {

    const { ITEM_IMAGE, ITEM_NAME, CLASS_NAME, ENTP_NAME, ETC_OTC_NAME, FORM_CODE_NAME } = medicineListItem;

    return (
        <div className='medicine-list-item'>
            <div className='medicine-list-item-image' style={{ backgroundImage: `url(${ITEM_IMAGE})` }}></div>
            <div className='medicine-list-item-name'>{ITEM_NAME}</div>
            <div className='medicine-list-item-content'>{CLASS_NAME}</div>
            <div className='medicine-list-item-content-bottom'>{FORM_CODE_NAME}</div>
            <div className='medicine-list-item-content-bottom'>{ENTP_NAME}</div>
            <div className={`medicine-list-item-content-${ETC_OTC_NAME === '일반의약품' ? 'ETC-Gold' : 'ETC-Red'}`}>{ETC_OTC_NAME}</div>
        </div>
    )
}
