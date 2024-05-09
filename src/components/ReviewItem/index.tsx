import React from 'react';
import './style.css';
import { ReviewListItem } from 'types/interface';

interface Props {
    reviewListItem: ReviewListItem;
}

export default function ReviewItem({reviewListItem}: Props) {
    const { reviewNumber, userId, itemSeq, content, writeDatetime, starRating, reviewImageList } = reviewListItem;

    const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= starRating) {
      stars.push(<div className="star star-full" />); // full 별
    } else {
      stars.push(<div className="star star-empty" />); // empty 별
    }
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
                <div className='review-content-id'>{userId} | <div className='review-date'>{writeDatetime}</div></div>
                <div className='review-content'>{content}</div>
                {reviewImageList.map(image => <img className='review-image' src={image} />)}
            </div>
        </div>
    </div>
)
}