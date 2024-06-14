import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, ChangeEvent, KeyboardEvent, useRef } from 'react'
import { MEDICINE_LOCATIONS_STORE_PATH } from 'constant';

export default function StoreSearch() {

//state: 검색어 상태
const [word, setWord] = useState<string>('');

//function: 네비게이트 함수
const navigate = useNavigate();

//state: 검색 버튼 요소 참조 상태
const searchButtonRef = useRef<HTMLDivElement | null>(null);

//event handler: 검색어 버튼 클릭 이벤트 처리 함수
const onSearchWordChangekHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWord(value);
}

const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!searchButtonRef.current) return;
    searchButtonRef.current.click();
};

const onSearchButtonClickHandler = () => {
    navigate(MEDICINE_LOCATIONS_STORE_PATH(word));
}

  return (
    <div id='search'>
    <div className='search-input-box'>
        <input className='search-input' type='text' placeholder='지역명을 입력해 주세요' value={word} onChange={onSearchWordChangekHandler} onKeyDown={onSearchWordKeyDownHandler}/>
            <div className='search-icon' ref={searchButtonRef} onClick={onSearchButtonClickHandler}></div>
        </div>
    </div>
  )
}
