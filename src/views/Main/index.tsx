import React from 'react'
import './style.css'
import Search from 'components/Search/Search';
import { MEDICINE_SEARCH_PATH } from 'constant'
import { useNavigate } from 'react-router-dom'

//메인 화면 컴포넌트
export default function Main() {
//function: 네비게이트 함수
const navigate = useNavigate();

//의약품 검색 박스 클릭
const onMedicineSearchClickHandler = () => {
  navigate(MEDICINE_SEARCH_PATH());
}
  
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
        <div className='main-content-box'>
          <div className='main-content-box-title'>의약품 검색</div>
          <div className='main-content-box-content'>의약품 정보 찾으러가기</div>
          <div className='main-box-content-search-image'></div>
        </div>
        <div className='main-content-box'>
          <div className='main-content-box-title'>상비약 판매처</div>
          <div className='main-content-box-content'>상비약을 판매하는</div>
          <div className='main-content-box-content-1'>편의점의 위치정보 보러가기</div>
          <div className='main-box-content-medicine-sale-image'></div>
        </div>
        <div className='main-content-box'>
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
            <div className='word-badge'>밀크시슬</div>
            <div className='word-badge'>방풍통성산</div>
            <div className='word-badge'>농포성여드름</div>
            <div className='word-badge'>인데놀</div>
            <div className='word-badge'>안정액</div>
            <div className='word-badge'>인데놀</div>
            <div className='word-badge'>농포성여드름</div>
            <div className='word-badge'>방풍통성산</div>
            <div className='word-badge'>밀크시슬</div>
            <div className='word-badge'>인데놀</div>
          </div>
        </div>  
      </div>
    </div>
    </>
  )
}
