import React, { useState } from 'react';
import './style.css';
import { ReviewListItem } from 'types/interface';
import { useLoginUserStore } from 'stores';
import { useCookies } from 'react-cookie';
import { deleteReviewRequest } from 'apis';
import { DeleteReviewResponseDto } from 'apis/response/review'
import { ResponseDto } from 'apis/response';
import { useNavigate } from 'react-router-dom';

interface Props {
    reviewListItem: ReviewListItem;
    onDeleteSuccess: () => void;
}

export default function ReviewItem({reviewListItem, onDeleteSuccess}: Props) {
    const { reviewNumber, userId, itemSeq, content, writeDatetime, starRating, reviewImageList } = reviewListItem;

    const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= starRating) {
      stars.push(<div className="star star-full" />); // full 별
    } else {
      stars.push(<div className="star star-empty" />); // empty 별
    }
  }

  //more 버튼 상태
  const[showMore, setShowMore] = useState<boolean>(false);
  //리뷰
  const[review, setReview] = useState<ReviewListItem | null>(null);
  //state:로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  //쿠키 상태
  const[cookies, setCookies] = useCookies();
  //글 작성자 여부 상태
  const isWriter = loginUser ? loginUser.userId === reviewListItem.userId : false;

  //function: delete board response 처리 함수
  const deleteReviewResponse = (responseBody: DeleteReviewResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'VF') alert('잘못된 접근입니다.');
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !== 'SU') alert('댓글이 삭제에 실패했습니다.'); 
    if(code === 'SU') alert('댓글이 삭제되었습니다.'); 
    onDeleteSuccess()
    return;
  }

  //more 버튼 클릭 이벤트 처리
  const onMoreButtonClickHandler = () => {
    setShowMore(!showMore);
  }

  //event handler: 수정 버튼 클릭 이벤트 처리
    // const onUpdateButtonClickHandler = () => {
    //   if(!review  || !loginUser) return;
    //   if(loginUser.user_id !== review.writerEmail) return;
    //   navigate(MEDICINE_SEARCH_PATH() + '/' + BOARD_UPDATE_PATH(review.reviewNumber));
    // }

//삭제 버튼 클릭 이벤트 처리
const onDeleteButtonClickHandler = () => {
  console.log("onDeleteButtonClickHandler 호출됨");
  if(!reviewNumber || !loginUser || !cookies.accessToken) {
    console.log({ reviewNumber, loginUserUserId: loginUser?.userId, accessToken: cookies.accessToken });

    console.log("필수 값 누락");
    return;
  }
  if(loginUser.userId !== userId) {
    console.log("사용자 ID 불일치");
    return;
  }
  deleteReviewRequest(reviewNumber, cookies.accessToken)
    .then(deleteReviewResponse)
    .catch(error => console.error(error)); 
}


return (
    <div className='review-list-item'>
        <div className='review-line'></div>
        <div className='review-list-item-top'>
            <div className='review-content-box'>
                 <div className="review-rating">
                    {stars}
                    <div className='review-rating-number'>{starRating}</div>
                    </div>
                    {isWriter && 
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
            }
            {showMore &&
            <div className='board-detail-more-box'>
              {/* <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div> */}
              <div className='divider'></div>
              <div className='board-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
            </div>
             }  
                <div className='review-content-id'>{userId} | <div className='review-date'>{writeDatetime}</div></div>
                <div className='review-content'>{content}</div>
                {reviewImageList.map(image => <img className='review-image' src={image} />)}
            </div>
        </div>
    </div>
)
}