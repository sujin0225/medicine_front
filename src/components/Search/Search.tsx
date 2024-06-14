import { useState, ChangeEvent, useRef, KeyboardEvent, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Search.css';
import { SEARCH_PATH } from 'constant';
import { PostSearchRequestDto } from "apis/request/search";
import { postSearchRequest } from "apis";
import { PostSearchResponseDto } from "apis/response/search";
import { ResponseDto } from 'apis/response';


export default function Search() {
//state: 검색어 상태
const [word, setWord] = useState<string>('');

//function: 네비게이트 함수
const navigate = useNavigate();

//state: 검색 버튼 요소 참조 상태
const searchButtonRef = useRef<HTMLDivElement | null>(null);

//state: 검색어 path variable 상태
const { searchWord } = useParams();

//state: 검색어 상태
const [searchType, setSearchType] = useState<'medicine' | 'MedicineStore'>('medicine');


//event handler: 검색어 버튼 클릭 이벤트 처리 함수
const onSearchWordChangekHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWord(value);
}

//검색어 저장
const postSearchResponse = (responseBody: PostSearchResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    console.log(code)

    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    console.log(code);
    if(code !== 'SU') return;
  }

//event handler: 검색 버튼 클릭 이벤트 처리 함수
// const onSearchButtonClickHandler = () => {
//     navigate(SEARCH_PATH(word));
//     const requestBody: PostSearchRequestDto = {
//         searchWord:word
//     };

//     postSearchRequest(word, requestBody).then(postSearchResponse);
// }
const onSearchButtonClickHandler = () => {
    let path;
    let requestBody;

    if (searchType === 'medicine') {
        path = SEARCH_PATH(word);
        requestBody = { searchWord: word };
        navigate(path);
        postSearchRequest(word, requestBody).then(postSearchResponse);
    } else if (searchType === 'MedicineStore') {
        // path = SEARCH_CONVENIENCE_STORE_PATH(word);
        requestBody = { searchWord: word };
    }
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
        {/* <input className='search-input' type='text' placeholder='의약품명을 입력해주세요.' value={word} onChange={onSearchWordChangekHandler} onKeyDown={onSearchWordKeyDownHandler}/> */}
        <input className='search-input' type='text' placeholder={searchType === 'medicine' ? '의약품명을 입력해주세요.' : '지역을 입력해주세요.'} value={word} onChange={onSearchWordChangekHandler} onKeyDown={onSearchWordKeyDownHandler} />
            <div className='search-icon' ref={searchButtonRef} onClick={onSearchButtonClickHandler}></div>
        </div>
    </div>
  )
}
