import { useState, ChangeEvent, useRef, KeyboardEvent, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Search.css';
import { SEARCH_PATH } from 'constant';


export default function Search() {
//state: 검색어 상태
const [word, setWord] = useState<string>('');

//function: 네비게이트 함수
const navigate = useNavigate();

//state: 검색 버튼 요소 참조 상태
const searchButtonRef = useRef<HTMLDivElement | null>(null);

//state: 검색어 path variable 상태
const { searchWord } = useParams();

//event handler: 검색어 버튼 클릭 이벤트 처리 함수
const onSearchWordChangekHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWord(value);
}

//event handler: 검색 버튼 클릭 이벤트 처리 함수
const onSearchButtonClickHandler = () => {
    navigate(SEARCH_PATH(word));
}

const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !== 'Enter') return;
    if(!searchButtonRef.current) return;
    searchButtonRef.current.click();
};


//effect: 검색어 path variable 변경 될때 마다 실행될 함수
useEffect(() => {
    if (searchWord) {
        setWord(searchWord);
    }
}, [searchWord]);

  return (
    <div id='search'>
    <div className='search-input-box'>
        <input className='search-input' type='text' placeholder='제품명, 코드, 업체명등 입력해주세요.' value={word} onChange={onSearchWordChangekHandler} onKeyDown={onSearchWordKeyDownHandler}/>
            <div className='search-icon' ref={searchButtonRef} onClick={onSearchButtonClickHandler}></div>
        </div>
    </div>
  )
}
