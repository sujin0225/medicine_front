import React, { useState, useEffect } from 'react'
import './style.css'
import Search from 'components/Search/Search';
import { MEDICINE_SEARCH_PATH, MEDICINE_STORE_PATH } from 'constant'
import { useNavigate } from 'react-router-dom'
import { GetPopularListReponseDto } from 'apis/response/search';
import { ResponseDto } from 'apis/response';
import { getPopularListRequest } from 'apis';
import { SEARCH_PATH, USER_PATH } from 'constant';
import { useLoginUserStore } from 'stores'

//메인 화면 컴포넌트
export default function Main() {
//state: 인기 검색어 리스트 상태
const [popularWordList, setPopularWordList] = useState<string[]>([]);

//function: 네비게이트 함수
const navigate = useNavigate();

//state: 로그인 유저 상태
const { loginUser } = useLoginUserStore();

//의약품 검색 박스 클릭
const onMedicineSearchClickHandler = () => {
  navigate(MEDICINE_SEARCH_PATH());
}

//event handler: 상비약 판매처 버튼 클릭 이벤트 처리 함수
const onMedicineStoreClickHandler = () => {
  navigate(MEDICINE_STORE_PATH());
};

//event handler: 마이페이지 버튼 클릭 이벤트 처리 함수
const onMyPageButtonClickHandler = () => {
  if(!loginUser) return;
  const { userId } = loginUser;
  navigate(USER_PATH(userId));
};

//function: get popular list response 처리 함수
const getPopularListResponse = (responseBody: GetPopularListReponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if (code === 'DBE') alert('데이터베이스 오류입니다.');
  if (code !== 'SU') return;

  const { popularWordList } = responseBody as GetPopularListReponseDto;
  setPopularWordList(popularWordList);
};

//event handler: 인기 검색어 클릭 이벤트 처리
const onPopularWordClickHandler = (word: string) => {
  navigate(SEARCH_PATH(word));
}

useEffect(() => { 
  getPopularListRequest().then(getPopularListResponse);
}, []);
  
  return (
    <>
    <div className='main-background-image'>
      <div id='main'>
        <div className='main-background-container'>
          <div className='main-text-box'>
          <div className='main-image-text-content'>식품의약품안전처 제공 데이터</div>
          </div>
          <div className='main-text-box-bold'>
          <div className='main-image-text-title'>의약품이 궁금할 땐, </div>
          <div className='main-image-text-title-bold'>이게머약?</div>
          </div>
        </div>
      </div>
    </div>
    
    <div id='main-middle-wrapper'>
      <div className='main-middle-background-container'>
      <Search />
      <div className='main-text-box-title'>
        <div className='main-text-title-gold'>이게머약?</div>
        <div className='main-text-title-content'>에서 이용하세요!</div>
      </div>
      <div className='main-content-box-container'>
        <div className='main-content-box' onClick={onMedicineSearchClickHandler}>
          <div className='main-content-box-title'>의약품 검색</div>
          <div className='main-content-box-content'>의약품 정보 찾으러가기</div>
          <div className='main-box-content-search-image'></div>
        </div>
        <div className='main-content-box' onClick={onMedicineStoreClickHandler}>
          <div className='main-content-box-title'>상비약 판매처</div>
          <div className='main-content-box-content'>상비약을 판매하는</div>
          <div className='main-content-box-content-1'>편의점의 위치정보 보러가기</div>
          <div className='main-box-content-medicine-sale-image'></div>
        </div>
        <div className='main-content-box' onClick={onMyPageButtonClickHandler}>
          <div className='main-content-box-title'>관심 의약품</div>
          <div className='main-content-box-content'>나의 관심 의약품 보러가기</div>
          <div className='main-box-content-medicine-image'></div>
        </div>
        </div>
        <div className='main-text-box-title'>
          <div className='main-text-title-gold'>인기 검색어</div>
        </div>
        <div className='main-popular-card'>
          <div className='main-popular-card-contents'>
          {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
          </div>
        </div>  
      </div>
    </div>
    </>
  )
}
