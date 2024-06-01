import React, { useState } from 'react'
import './style.css';
import { MyReview } from 'types/interface';
import { useNavigate } from 'react-router-dom';
import { MEDICINE_DETAIL_PATH } from 'constant';

interface Props {
    MyReview: MyReview;
}

export default function MyReviewItem({ MyReview }: Props) {
    const { userId, itemSeq, content, reviewImageList, writeDatetime, 
        helpfulCount, starRating} = MyReview;
    //도움돼요 버튼 상태
    const [helpful, setHelpful] = useState<boolean>(false);    
    //function: 네비게이트 함수 
    const navigate = useNavigate();
    //event handler: 의약품 클릭 이벤트 처리 함수 
    const onClickHandler = () => {
        navigate(MEDICINE_DETAIL_PATH(itemSeq));
    }

        const stars = [];
        for (let i = 1; i <= 5; i++) {
          if (i <= starRating) {
            stars.push(<div className="star star-full" />); // full 별
          } else {
            stars.push(<div className="star star-empty" />); // empty 별
          }
        }

  return (
    <div className='mypage-myreview-container' onClick={onClickHandler}>
    <div className='mypage-myreview-content-box'>
    <div className="rating-and-stars">
    <div className="rating-container">
        {stars}
          <div className='review-rating-number'>{starRating}</div>
          </div>
        </div>
        <div className='review-content-id'>{userId} | <div className='review-date'>{writeDatetime}</div></div>
  <div className='review-content'>{content}</div>
    {reviewImageList.map(image => <img className='review-image' src={image} />)}
    <div className='helpful'>도움돼요
    <div className='helpful-button'>
    {helpful ?
      <div className='icon helpful-full'></div> :
      <div className='icon helpful-empty'></div>
    }
    </div>
    <div className='helpful-count'>{helpfulCount}</div>
  </div>
    </div>
    </div>
  )
}
