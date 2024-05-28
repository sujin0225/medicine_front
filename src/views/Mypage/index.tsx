import React, { useState, useEffect } from 'react'
import'./style.css';
import MypageNavigate from 'components/MyPage_navigate';
import MyMedicineItem from 'components/MyMedicineItem';
import { useLoginUserStore } from 'stores'
import Pagination from 'components/Pagination/Pagination';
import { GetFavoriteMedicineResponseDto } from 'apis/response/review'
import { ResponseDto } from 'apis/response';
import { getFavoriteMedicineRequest } from 'apis'
import { useCookies } from 'react-cookie';
import { FavoriteMedicine } from 'types/interface';

export default function Mypage() {

const { loginUser } = useLoginUserStore();
const userId = loginUser?.userId;
//관심 의약품 리스트 상태
const [FavoriteMedicine, setFavoriteMedicine] = useState<FavoriteMedicine[]>([]);
//state: 페이지 변경 상태
const [currentPage, setCurrentPage] = useState(1);
//state: 전체 관심 의약품 개수 상태
const [totalFavoriteMedicineCount, setTotalFavoriteMedicineCount] = useState<number>(0);
//쿠키 상태
const[cookies, setCookies] = useCookies();

const getFavoriteMedicineResponse = (responseBody: GetFavoriteMedicineResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if (code === 'DBE') alert('데이터베이스 오류입니다.');
  if (code !== 'SU') return;

  const { favoriteListItems } = responseBody as GetFavoriteMedicineResponseDto;
  setFavoriteMedicine(favoriteListItems)
  console.log(favoriteListItems);
  console.log(responseBody)
  setTotalFavoriteMedicineCount(favoriteListItems.length);
};

const handlePageChange = (newPageNo: number) => {
  setCurrentPage(newPageNo); // 페이지 번호 변경
  // fetchData(newPageNo); // 변경된 페이지 번호로 데이터 다시 가져오기
  
};

useEffect(() => {
  getFavoriteMedicineRequest(cookies.accessToken).then(getFavoriteMedicineResponse);
}, []);

  return (
    <div id='mypage-wrapper'>
  <div className='mypage-container'>
    <div className='mypage-contents-box'>
      <div className='mypage-navigate-box'>
        <div className='mypage-navigate-box-id'>안녕하세요, {userId}님!</div>
        <MypageNavigate/> 
      </div>
      <div className='mypage-contents-detail'>
        <div className='mypage-contents-box-text'>관심 의약품</div>
        <Pagination
          render={() => (
          totalFavoriteMedicineCount > 0 ? ( 
          FavoriteMedicine.slice((currentPage-1)*6, currentPage*6).map((FavoriteMedicine, index) => (
          <MyMedicineItem key={index} FavoriteMedicine={FavoriteMedicine} />
          ))
          ):(
          <div className='review-empty'>해당 의약품 리뷰가 없습니다.</div>
          )
          )}
          onPageChange={handlePageChange}
          currentPage={currentPage} 
          totalPages={Math.ceil(totalFavoriteMedicineCount / 6)}
        />
      </div>
    </div>
  </div>
</div>
  )
}
