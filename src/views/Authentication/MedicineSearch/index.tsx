import React from 'react'
import './style.css'
import { medicine } from 'publicapi';
import { useEffect } from 'react';

export default function MedicineSearch() {
  // useEffect(() => {
    // medicine 함수 호출
    medicine();
  // }, []);

  return (
    <div className='medicine-search-background'>
      <div id='medicine-search'>
        <div className='medicine-search-background-container'>
          <div className='medicine-search-text-box'>
            <div className='medicine-search-text-title'>의약품</div>
            <div className='medicine-search-text-title-bold'>검색</div>
          </div>
          <div className='medicine-search-text-content'>식품의약품안전처 제공 데이터를 사용합니다.</div>
        </div>
      </div>
    </div>
  )
}
