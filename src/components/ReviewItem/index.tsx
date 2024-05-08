import React from 'react';
import './style.css';
import { ReviewListItem } from 'types/interface';

interface Props {
    reviewListItem: ReviewListItem;
}

export default function ReviewItem({reviewListItem}: Props) {
    const { reviewNumber, userId, itemSeq, content, writeDatetime, starRating, reviewImageList } = reviewListItem;

return (
    <div className='review-list-item'>
        <div className='review-line'></div>
        <div className='review-list-item-top'>
            <div className='review-content-box'>
                <div className='review-rating'>{starRating}점</div>
                <div className='review-content-id'>{userId} | <div className='review-date'>{writeDatetime}</div></div>
                <div className='review-content'>{content}</div>
                {reviewImageList.map(image => <img className='review-image' src={image} />)}
            </div>
        </div>
    </div>
)
}