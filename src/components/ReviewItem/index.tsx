import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import './style.css';
import { HelpfulListItem, ReviewListItem } from 'types/interface';
import { useLoginUserStore, useReviewStore } from 'stores';
import { useCookies } from 'react-cookie';
import { deleteReviewRequest } from 'apis';
import { DeleteReviewResponseDto, PatchReviewResponseDto, GetReviewResponseDto, PutFavoriteResponseDto, GetHelpfulResponseDto } from 'apis/response/review';
import { ResponseDto } from 'apis/response';
import { convertUrlsToFile } from 'utils';
import Rating from "components/Rating/Rating";
import { GetReviewListRequest, patchReviewRequest, fileuploadRequest, getReviewRequest, putHelpfulRequest, getHelpfulListRequest } from 'apis';
import { PatchReviewRequestDto } from 'apis/request/review';
import { Myalert } from 'components/alert';

interface Props {
    reviewListItem: ReviewListItem;
    onSuccessUpdate: () => void;
}

export default function ReviewItem({reviewListItem, onSuccessUpdate}: Props) {
    const { reviewNumber, userId, itemSeq, content, writeDatetime, starRating, reviewImageList, helpfulCount } = reviewListItem;

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
  //리뷰 수정 input 상태
  const [isUpdate, setIsUpdate] = useState(false);
  //리뷰 수정글 상태
  const { reviewcontent, setContent } = useReviewStore();
  const { reviewImageFileList, setReviewImageFileList } = useReviewStore();
  //게시물 이미지 미리보기 URL 상태
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  //리뷰 리스트 상태
  const [ReviewList, setReviewList] = useState<ReviewListItem[]>([]);
  //state: 이미지 입력 요소 참조 상태
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //state: 본문 영역 요소 참조 상태
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  //리뷰 별점 상태
  const [StarRating, setStarRating] = useState<number>(5);
  //도움돼요 버튼 상태
  const [helpful, setHelpful] = useState<boolean>(false);
  //도움돼요 리스트 상태
  const [helpfulList, setHelpfulList] = useState<HelpfulListItem[]>([]);

//get review response 처리 함수
const getReviewResponse = (reviewNumber:number,  responseBody: GetReviewResponseDto | ResponseDto | null) => {
  const { content, userId, reviewNumber:reviewNumberFromResponse, reviewImageList, starRating } = responseBody as GetReviewResponseDto;
  console.log(content, userId, reviewNumber, reviewImageList, starRating);
  setContent(content);
  setStarRating(starRating);
  setImageUrls(reviewImageList);
  convertUrlsToFile(reviewImageList).then(reviewImageFileList => setReviewImageFileList(reviewImageFileList));

  if(!loginUser || loginUser?.userId !== userId) {
    
  }

  if(!contentRef.current) return;
  contentRef.current.style.height = 'auto';
  contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
};


  //delete review response 처리 함수
  const deleteReviewResponse = (responseBody: DeleteReviewResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'VF') alert('잘못된 접근입니다.');
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !== 'SU') alert('댓글 삭제에 실패했습니다.'); 
    if(code === 'SU') Myalert("success", "리뷰 삭제 완료", "리뷰 삭제에 성공했습니다!", "확인")
    onSuccessUpdate()
    setShowMore(false);
    return;
  }

  //function: patch board response 처리 함수
  const patchReviewResponse = (responseBody: PatchReviewResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code === 'VF') alert('리뷰내용은 필수입니다.');
    if(code !== 'SU') return;

    setReviewImageFileList([]);
    onSuccessUpdate()
    setShowMore(false);
    setIsUpdate(false);
}

    //function: put helpful response 처리 함수
    const putHelpfulResponse = (responseBody: PutFavoriteResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'VF') alert('잘못된 접근입니다.');
      if(code === 'NU') alert('존재하지 않는 유저입니다.');
      if(code === 'AF') alert('인증에 실패했습니다.');
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;
      if(!reviewNumber) return;
      getHelpfulListRequest(reviewNumber).then(gethelpfulListResponse);
      // setHelpful(prev => !prev);
      onSuccessUpdate()
    }

//get helpfulList response 처리 함수
const gethelpfulListResponse = (responseBody: GetHelpfulResponseDto | ResponseDto | null) => {
  if(!responseBody) return;
  const { code } = responseBody;
  if(code === 'DBE') {
    alert('데이터베이스 오류입니다.');
    return;
  }
  if(code !== 'SU') return;
  console.log(code)

  const { helpfulList } = responseBody as GetHelpfulResponseDto;
  setHelpfulList(helpfulList);
  console.log(helpfulList)

  if(!loginUser) {
    setHelpful(false);
    return;
  }
  const isHelpful = helpfulList.findIndex(helpful => helpful.userId === loginUser.userId) !== -1;
  setHelpful(isHelpful);
}

useEffect(() => {
  getHelpfulListRequest(reviewNumber).then(gethelpfulListResponse);
}, [reviewNumber]);

//event handler: 내용 변경 이벤트 처리
const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
  const { value } = event.target;
  setContent(value);

  if(!contentRef.current) return;
  contentRef.current.style.height = 'auto';
  contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
}

//event handler: 이미지 변경 이벤트 처리
const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
  if(!event.target.files || !event.target.files.length) return;
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  const newImageUrls = imageUrls.map(item => item);
  newImageUrls.push(imageUrl);
  setImageUrls(newImageUrls);
  const newReviewImageFileList = reviewImageFileList.map(item => item);
  newReviewImageFileList.push(file);
  setReviewImageFileList(newReviewImageFileList);

  if(!imageInputRef.current) return;
  imageInputRef.current.value = '';
}

  //event handler: 이미지 업로드 버튼 클릭 이벤트 처리
  const onImageUploadButtonClickHandler = () => {
    if(!imageInputRef.current) return;
    imageInputRef.current.click();
  }

  //이미지 닫기 버튼 클릭 이벤트 처리
  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    if(!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newReviewImageFileList = reviewImageFileList.filter((file, index) => index !== deleteIndex);
    setReviewImageFileList(newReviewImageFileList);
  }

  //도움돼요 버튼 클릭 이벤트 처리
  const onHelpfulClickHandler = () => {
    if(!reviewNumber || !loginUser || !cookies.accessToken) {
      Myalert("warning", "로그인 안내", "로그인이 필요한 서비스입니다.", "확인")
      return;
    }
    putHelpfulRequest(reviewNumber, cookies.accessToken).then(putHelpfulResponse);
  }

//more 버튼 클릭 이벤트 처리
const onMoreButtonClickHandler = () => {
  setShowMore(!showMore);
}

//수정 버튼 클릭 이벤트 처리
const onUpdateButtonClickHandler = async () => {
  if (!reviewNumber || !loginUser) return;
  console.log({ reviewNumber, content, loginUserUserId: loginUser?.userId, accessToken: cookies.accessToken });
  if (loginUser.userId !== userId) {
    console.log("사용자 ID 불일치");
    return;
  }

  try {
    const responseBody = await getReviewRequest(reviewNumber);
    getReviewResponse(reviewNumber, responseBody);
  } catch (error) {
    console.error("리뷰 정보를 가져오는 중 오류 발생", error);
  }
  setIsUpdate(prev => !prev);
}

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
  deleteReviewRequest(reviewNumber, cookies.accessToken).then(deleteReviewResponse).catch(error => console.error(error)); 
}

  //리뷰 작성 버튼 클릭 이벤트 처리
  const onReviewSubmitButtonClickHandler = async () => {
    const accessToken = cookies.accessToken;
    console.log("리뷰 작성 버튼 클릭");
    if(!accessToken) {
      alert('로그인 해주세요!');
      return;
    }
    const reviewImageList: string[] = [];
    for(const file of reviewImageFileList) {
        const data = new FormData();
        data.append('file', file);
  
        const url = await fileuploadRequest(data);
        if(url) reviewImageList.push(url);
    }
  
    const requestBody: PatchReviewRequestDto = { content: reviewcontent, starRating: StarRating, reviewImageList: reviewImageList };
  
    console.log("리뷰:", requestBody);
  
    if(accessToken) {
      Myalert("success", "리뷰 수정 완료", "리뷰 수정에 성공했습니다!", "확인")
      patchReviewRequest(reviewNumber, requestBody, accessToken).then(patchReviewResponse);
    }
  }

return (
  <div className='review-list-item'>
    <div className='review-line'></div>
      <div className='review-list-item-top'>
        <div className='review-content-box'>
          <div className='review-rating'>
          <div className="rating-and-stars">
          <div className="rating-container">
          {stars}
          <div className='review-rating-number'>{starRating}</div>
        </div>
      </div>
    <div className="actions">
    {isWriter && 
      <div className='icon-button' onClick={onMoreButtonClickHandler}>
        <div className='more-icon'></div>
      </div>
      }
      {showMore &&
        <div className='review-detail-more-box'>
          <div className='review-detail-update-button' onClick={onUpdateButtonClickHandler}>{'수정'}</div>
          <div className='review-detail-delete-button' onClick={onDeleteButtonClickHandler}>{'삭제'}</div>
        </div>
        }  
    </div>
</div>
<div className='review-content-id'>{userId} | <div className='review-date'>{writeDatetime}</div></div>
  <div className='review-content'>{content}</div>
    {reviewImageList.map(image => <img className='review-image' src={image} />)}
    <div className='helpful'>도움돼요
    <div className='helpful-button' onClick={onHelpfulClickHandler}>
    {helpful ?
      <div className='icon helpful-full'></div> :
      <div className='icon helpful-empty'></div>
    }
    </div>
    <span className='helpful-count'>{helpfulCount}</span>
  </div>
    {isUpdate && (
       <div className='showreview'>
        <div className='rating-gap'>
          <Rating
            count={5}
            value={StarRating} 
            onChange={(value) => setStarRating(value)}
            /> 
            <div className='rating-number'>{StarRating}</div>
              </div>
                <div className='review-input-box'>
                    <div className='review-input-container'>
                        <div className='board-write-content-box'>
                            <textarea className='review-textarea' placeholder='리뷰를 작성해보세요.' onChange={onContentChangeHandler} value={reviewcontent} ref={contentRef}/>
                            <div className='camera-icon' onClick={onImageUploadButtonClickHandler}></div>
                            <input type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler} ref={imageInputRef}/>
                        </div>
                    </div>
                    <div className='board-write-images-box'>
                        {imageUrls.map((imageUrl, index) => (
                            <div className='review-write-image-box' key={index}>
                                <img className='write-image' src={imageUrl} alt="Review"/>
                                <div className='image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                    <div className='close-icon'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='review-button-box'>
                  <div className='brown-button' onClick={onReviewSubmitButtonClickHandler}>{'수정하기'}</div>
                </div>
                </div>
              </div>
            )}
      </div>
    </div>
  </div>
  )
}