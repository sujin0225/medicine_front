import React from 'react'
import './style.css';
import { MyReview } from 'types/interface';

interface Props {
    MyReview: MyReview;
}

export default function MyReviewItem({ MyReview }: Props) {
    const { userId, itemSeq, content, reviewImageList, writeDatetime, 
        helpfulCount, starRating} = MyReview;

        const stars = [];
        for (let i = 1; i <= 5; i++) {
          if (i <= starRating) {
            stars.push(<div className="star star-full" />); // full 별
          } else {
            stars.push(<div className="star star-empty" />); // empty 별
          }
        }

  return (
<div className="rating-and-stars">
          <div className="rating-container">
          {stars}
          <div className='review-rating-number'>{starRating}</div>
        </div>
      </div>
  )
}
