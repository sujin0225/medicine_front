import React, { useState, useEffect } from 'react'
import'./style.css';
import MypageNavigate from 'components/MyPage_navigate';
import { useLoginUserStore } from 'stores'
import Pagination from 'components/Pagination/Pagination';
import type { MyReview } from 'types/interface';
import MyReviewItem from 'components/MyReviewItem';
import { GetMyReviewResponseDto } from 'apis/response/review';
import { ResponseDto } from 'apis/response';
import { getMyReviewRequest } from 'apis';
import { useCookies } from 'react-cookie';

export default function MyReview() {

const { loginUser } = useLoginUserStore();
const userId = loginUser?.userId;
//내가 작성한 리뷰 리스트 상태
const [reviewListItems, setReviewListItems] = useState<MyReview[]>([]);
//state: 전체 관심 의약품 개수 상태
const [totalMyReviewCount, setTotalMyReviewCount] = useState<number>(0);
//state: 페이지 변경 상태
const [currentPage, setCurrentPage] = useState(1);
//쿠키 상태
const[cookies, setCookies] = useCookies();

const getMyReviewResponse = (responseBody: GetMyReviewResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if (code === 'DBE') alert('데이터베이스 오류입니다.');
  if (code !== 'SU') return;

  const { reviewListItems } = responseBody as GetMyReviewResponseDto;
  setReviewListItems(reviewListItems)
  console.log("MyReview:",reviewListItems);
  console.log("responseBody:",responseBody);
  setTotalMyReviewCount(reviewListItems.length);
}

const handlePageChange = (newPageNo: number) => {
  setCurrentPage(newPageNo); // 페이지 번호 변경
  // fetchData(newPageNo); // 변경된 페이지 번호로 데이터 다시 가져오기
};

useEffect(() => {
  getMyReviewRequest(cookies.accessToken).then(getMyReviewResponse);
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
        <div className='mypage-contents-box-text'>내가 작성한 리뷰</div>
        <Pagination
          render={() => (
          totalMyReviewCount > 0 ? ( 
          reviewListItems.slice((currentPage-1)*6, currentPage*6).map((MyReview, index) => (
          <MyReviewItem key={index} MyReview={MyReview} />
          ))
          ):(
          <div className='mypage-contents-empty'>내가 작성한 리뷰가 없습니다.</div>
          )
          )}
          onPageChange={handlePageChange}
          currentPage={currentPage} 
          totalPages={Math.ceil(totalMyReviewCount / 6)}
        />
      </div>
    </div>
  </div>
</div>
  )
}