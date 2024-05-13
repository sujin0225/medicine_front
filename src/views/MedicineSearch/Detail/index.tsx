import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import './style.css'
import { medicineDetail } from 'publicapi';
import { medicinepermission } from 'publicapi';
import { MedicineListItem, medicinepermissionList, ReviewListItem } from 'types/interface';
import { MedicineinfoItem } from 'types/interface';
import { medicineinfo } from 'publicapi';
import { GetReviewListRequest, postReviewRequest, fileuploadRequest } from 'apis'
import { ResponseDto } from 'apis/response';
import { GetReviewListResponseDto } from 'apis/response/review';
import ReviewItem from 'components/ReviewItem';
import { MAIN_PATH } from 'constant';
import Pagination from 'components/Pagination/Pagination';
import { useLoginUserStore, useReviewStore } from 'stores';
import { useCookies } from 'react-cookie';
import { PostReviewResponseDto } from 'apis/response/review';
import { PostReviewRequestDto } from 'apis/request/review';
import Rating from "components/Rating/Rating";

export default function MedicineDetail() {
  const [toggleState, setToggleState] = useState(1);
  const { ITEM_SEQ } = useParams();
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  const [medicinepermissionList, setMedicinepermissionList] = useState<medicinepermissionList[]>([]);
  const [medicineinfoList, setMedicineinfoList] = useState<MedicineinfoItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  //리뷰 작성하기 버튼 상태
  const [isReview, setIsReview] = useState<boolean>(false);
  //state: 전체 댓글 개수 상태
  const [totalReviewCount, setTotalReviewCount] = useState<number>(0);
  //리뷰 리스트 상태
  const [ReviewList, setReviewList] = useState<ReviewListItem[]>([]);
  //state: 페이지 변경 상태
  const [currentPage, setCurrentPage] = useState(1);
  //리뷰 작성하기 버튼 클릭 상태
  const [showReview, setShowReview] = useState<boolean>(false);
  //리뷰 작성 상태
  const [review, setReview] = useState<string>('');
  //리뷰 별점 상태
  const [starRating, setStarRating] = useState<number>(5);
  //리뷰 textarea 참조 상태
  const reviewRef = useRef<HTMLTextAreaElement | null>(null);
  //로그인 유저 상태
  const { loginUser } = useLoginUserStore();
  //쿠키 상태
  const[cookies, setCookies] = useCookies();
  //이미지 입력 요소 참조 상태
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //게시물 이미지 미리보기 URL 상태
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  //게시물 이미지 리스트
  const { reviewImageFileList, setReviewImageFileList } = useReviewStore();
  const location = useLocation();

  const toggleTab = (index: number) => {
      setToggleState(index);
  };

  //아코디언 toggle
  const [selected, setSelected] = useState<number | null>(null);

  //네비게이트
  const navigate = useNavigate();

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

useEffect(() => {
    fetchData(ITEM_SEQ ?? '');
    fetchDataper(ITEM_SEQ ?? '');
    fetchDatainfo(ITEM_SEQ ?? '');
}, [ITEM_SEQ]);

  //의약품 상세 정보
  const fetchData = async (ITEM_SEQ: string) => {
      try {
          const data = await medicineDetail(ITEM_SEQ); 
          setMedicineList(data.body.items); 
          setTotalCount(data.body.totalCount); 
          console.log("의약품 상세 불러오기:", data.body.items); 
      } catch (error) {
          console.error('데이터 불러오기 에러:', error);
      }
  };

  //의약품 제품 허가정보
  const fetchDataper = async (ITEM_SEQ: string) => {
    try {
      const data = await medicinepermission(ITEM_SEQ);
      // 데이터를 가져온 후에 가공
      const permissionList = data.body.items || []; // 데이터가 없을 경우 빈 배열로 초기화
      const totalCount = data.body.totalCount || 0; // totalCount가 없을 경우 0으로 초기화
      console.log("의약품 제품 허가정보 불러오기:", permissionList);
      
      // 상태를 업데이트
      setMedicinepermissionList(permissionList);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('데이터 불러오기 에러:', error);
    }
  };
  

//의약품 복약 정보
const fetchDatainfo = async (ITEM_SEQ: string) => {
    try {
        const data = await medicineinfo(ITEM_SEQ); 
        setMedicineinfoList(data.body.items); 
        setTotalCount(data.body.totalCount); 
        console.log("의약품 복약 정보 불러오기:", data.body.items); 
    } catch (error) {
        console.error('데이터 불러오기 에러:', error);
    }
};

//리뷰 글 불러오기(Get)
const getReviewListResponse = (responseBody: GetReviewListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !== 'SU') return;
    
    const { reviewListItems } = responseBody as GetReviewListResponseDto;
    setReviewList(reviewListItems);
    setTotalReviewCount(reviewListItems.length);
}

//리뷰 글 작성(Post)
const postReviewResponse = (responseBody: PostReviewResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    
    // if(code === 'VF') alert('잘못된 접근입니다.');
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !== 'SU') return;
  
    // 리뷰 저장 성공 후 상태 초기화
    setReview(''); // 리뷰 내용 초기화
    setStarRating(5); // 별점 초기화
    setReviewImageFileList([]); // 이미지 목록 초기화
    setImageUrls([]);
    setReviewList([]); // 리뷰 목록 초기화 (필요한 경우)
  
    // 리뷰 목록 새로고침
    if(!ITEM_SEQ) return;
    GetReviewListRequest(ITEM_SEQ).then(getReviewListResponse);
  }
  

//effect: 게시물 번호 path variable이 바뀔때 마다 리뷰글 불러오기
useEffect(() => {
    if(!ITEM_SEQ) return;
    GetReviewListRequest(ITEM_SEQ).then(getReviewListResponse);
  }, [ITEM_SEQ]);


  const handlePageChange = (newPageNo: number) => {
    setCurrentPage(newPageNo); // 페이지 번호 변경
    // fetchData(newPageNo); // 변경된 페이지 번호로 데이터 다시 가져오기
  };

  //리뷰 작성하기 버튼 클릭 이벤트 처리
  const onShowReviewClickHandler = () => {
    setShowReview(!showReview);
  }

  //리뷰 작성 버튼 클릭 이벤트 처리
  const onReviewSubmitButtonClickHandler = async () => {
    const accessToken = cookies.accessToken;
    console.log("리뷰 작성 버튼 클릭");
    if(!review) {
      alert('내용을 입력해주세요!');
      return; 
    }
    if(!ITEM_SEQ) return;
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
  
    const requestBody: PostReviewRequestDto = { content: review, starRating: starRating, reviewImageList: reviewImageList };
  
    console.log("리뷰:", requestBody);
  
    if(accessToken) {
      alert('리뷰 작성이 완료되었습니다!')
      postReviewRequest(ITEM_SEQ, requestBody, accessToken).then(postReviewResponse);
    }
  }

  //리뷰 변경 이벤트 처리
  const onReviewChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setReview(value);
    if(!reviewRef.current) return;
    reviewRef.current.style.height = 'auto';
    reviewRef.current.style.height = `${reviewRef.current.scrollHeight}px`;
  }


  //이미지 업로드 버튼 클릭 이벤트 처리
  const onImageUploadButtonClickHandler = () => {
    if(!imageInputRef.current) return;
    imageInputRef.current.click();
  } 
  
//이미지 변경 이벤트 처리
const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    const newImageUrls = imageUrls.map(item => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);
    const newBoardImageFileList = reviewImageFileList.map(item => item);
    newBoardImageFileList.push(file);
    setReviewImageFileList(newBoardImageFileList);

    if(!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }  

  //event handler: 이미지 닫기 버튼 클릭 이벤트 처리
  const onImageCloseButtonClickHandler = (deleteIndex: number) => {
    if(!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = reviewImageFileList.filter((file, index) => index !== deleteIndex);
    setReviewImageFileList(newBoardImageFileList);
  }

  const refreshReviews = () => {
    if(!ITEM_SEQ) return;
    GetReviewListRequest(ITEM_SEQ).then(getReviewListResponse);
  };

const accordion = [
    {
        question: '효능',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='accordion-content-text'>
                        {infoItem.efcyQesitm}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        question: '사용법',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='accordion-content-text'>
                            {infoItem.useMethodQesitm}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        question: '주의사항',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-title-box' key={index}>
                        <div className='accordion-content-titel-text'>주의사항 경고<br/></div>
                        <div className='accordion-content-text'>
                            {infoItem.atpnWarnQesitm}
                        </div>
                        <div className='accordion-content-titel-text'>주의사항<br/></div>
                        <div className='accordion-content-text'>
                            {infoItem.atpnQesitm}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        question: '상호작용',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='accordion-content-text'>    
                            {infoItem.intrcQesitm}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        question: '부작용',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='accordion-content-text'> 
                            {infoItem.seQesitm}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        question: '보관법',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='accordion-content-text'> 
                            {infoItem.depositMethodQesitm}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        question: '수정일자, 공개일자',
        answer: (
            <div>
                {medicineinfoList && medicineinfoList.length > 0 && medicineinfoList.map((infoItem, index) => (
                    <div className='medicine-detail-basics-content-title-box' key={index}>
                        <div className='accordion-content-titel-text'>공개일자<br/></div>
                        <div className='accordion-content-text'>
                            {infoItem.openDe}<br/>
                        </div>
                        <div className='accordion-content-titel-text'>
                            수정일자<br/>
                        </div>
                        <div className='accordion-content-text'>     
                            {infoItem.updateDe}
                        </div>    
                    </div>
                ))}
            </div>
        ),
    }
  ]

  return (
      <div id='medicine-detail'>
          <div className='medicine-detail-container'>
              {medicineList.map((item, index) => (
                  <div className='medicine-detail-content-box' key={index}>
                      <div className='medicine-detail-image' style={{ backgroundImage: `url(${item.ITEM_IMAGE})` }}></div>
                      <div className='medicine-detail-text-container'>
                          <div className='medicine-detail-content-etc'>{item.ETC_OTC_NAME}</div>
                          <div className='medicine-detail-content-name'>{item.ITEM_NAME}</div>
                          <div className='medicine-detail-content-eng-name'>{item.ITEM_ENG_NAME}</div>
                      </div>
                  </div>
              ))}
              <div className="bloc-tabs">
                  <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>기본정보</button>
                  <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>전문가정보</button>
                  <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)}>식별정보</button>
                  <button className={toggleState === 4 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(4)}>복약정보</button>
                  <button className={toggleState === 5 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(5)}>리뷰</button>
              </div>
              <div className="content-tabs">
                {/* 기본정보 tab */}
                  {toggleState === 1 && <div className="content active-content">
                    <div className='medicine-detail-tabs-box'>
                    {medicineList.map((item, index) => (
                        <div className='medicine-detail-basics-content-box-main'>
                            <div className='medicine-detail-basics-content-box'>
                            <div className='medicine-detail-basics-title-top'>성분명</div>
                    {medicinepermissionList.length > 0 ? (
                    medicinepermissionList.map((permissionItem, index) => (
                        <div className='medicine-detail-text-container' key={index}>
                        <div className='medicine-detail-basics-content-top'>{permissionItem.MAIN_ITEM_INGR}</div>
                    <div className='medicine-detail-basics-content-eng'>{permissionItem.MAIN_INGR_ENG}</div>
            </div>
    ))
) : (
    
        <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-top'>-</div>
        </div>
)}
</div>
<div className='content-line-top'></div>
            <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>분류</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>[{item.CLASS_NO}] {item.CLASS_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>구분</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{item.ETC_OTC_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>제형</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{item.FORM_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        {/* <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>보험적용</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'></div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>보험적용</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'></div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>투여경로</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'></div>
            </div>
        </div>
        <div className='content-line'></div>  */}
        {/* {medicinepermissionList && medicinepermissionList.length > 0 && (
        <>
        {medicinepermissionList.map((permissionItem, index) => (
        <div className='medicine-detail-basics-content-box' key={index}>
            <div className='medicine-detail-basics-title'>판매사명</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>
                {item.ENTP_NAME} / {permissionItem.ENTP_ENG_NAME}
            </div>
        </div>
      </div>
    ))}
    <div className='content-line'></div>
  </>
)} */}
<div className='medicine-detail-basics-content-box'>
                            <div className='medicine-detail-basics-title'>판매사명</div>
                    {medicinepermissionList.length > 0 ? (
                    medicinepermissionList.map((permissionItem, index) => (
                        <div className='medicine-detail-text-container' key={index}>
                        <div className='medicine-detail-basics-content-four'>
                            {item.ENTP_NAME} / {permissionItem.ENTP_ENG_NAME}
                    </div>
            </div>
    ))
) : (
        <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-four'>{item.ENTP_NAME}</div>
        </div>
)}
</div>
<div className='content-line'></div>
     </div>
))}
    </div>

        </div>}
        {/* 전문가정보 tab */}
            {toggleState === 2 && <div className="content active-content">
            <div className='medicine-detail-tabs-box'>
            {medicineList.map((item, index) => (
                <div className='medicine-detail-basics-content-box-main'>
                    <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='medicine-detail-basics-title-top'>허가일</div>
                        <div className='medicine-detail-text-container'>
                        <div className='medicine-detail-basics-content-top'>{item.ITEM_PERMIT_DATE}</div>    
                    </div>
                </div>
            <div className='content-line-top'></div> 
                {/* <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>표준코드(대표)</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>[{item.CLASS_NO}] {item.CLASS_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div>  */}
           {/* {medicinepermissionList.length > 0 && medicinepermissionList.map((permissionItem, index) => (
        <div className='medicine-detail-basics-content-box' key={index}>
                <div className='medicine-detail-basics-title'>바코드</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{permissionItem.BAR_CODE}</div>
            </div>
        </div>
            ))} */}
            <div className='medicine-detail-basics-content-box'>
                            <div className='medicine-detail-basics-title'>바코드</div>
                    {medicinepermissionList.length > 0 ? (
                    medicinepermissionList.map((permissionItem, index) => (
                        <div className='medicine-detail-text-container' key={index}>
                        <div className='medicine-detail-basics-content-four'>
                        {permissionItem.BAR_CODE}
                    </div>
            </div>
    ))
) : (
        <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-four'>-</div>
        </div>
)}
</div>
        <div className='content-line'></div>
            <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>성상</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.CHART}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>품목일련번호</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.ITEM_SEQ}</div>
            </div>
        </div>
        <div className='content-line'></div>
<div className='medicine-detail-basics-content-box'>
    <div className='medicine-detail-basics-title'>ATC코드</div>
        {medicinepermissionList.length > 0 ? (
            medicinepermissionList.map((permissionItem, index) => (
                <div className='medicine-detail-text-container' key={index}>
            <div className='medicine-detail-basics-content'>{permissionItem.ATC_CODE !== null && permissionItem.ATC_CODE !== "" ? permissionItem.ATC_CODE : "-"}</div>
        </div>
    ))
) : (
        <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-four'>-</div>
        </div>
)}
</div>
        {/* <div className='content-line'></div> */}
        {/* <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>주성분코드</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'></div>
            </div>
        </div> */}
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>보험코드</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.EDI_CODE !== null && item.EDI_CODE !== "" ? item.EDI_CODE : "-"}</div>
                
            </div>
        </div>
        <div className='content-line'></div>
                </div>
            ))}

            </div>
                </div>}
                  {toggleState === 3 && <div className="content active-content">
                  <div className='medicine-detail-tabs-box-info'>
                    {medicineList.map((item, index) => (
                    <div className='medicine-detail-basics-content-box-main'>
                        <div className='medicine-detail-basics-content-box' key={index}>
                        <div className='medicine-detail-basics-title-top'>성상</div>
                        <div className='medicine-detail-text-container'>
                        <div className='medicine-detail-basics-content-info'>{item.CHART}</div>    
                    </div>
                </div>
            <div className='content-line-top'></div> 
            <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>의약품모양</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.DRUG_SHAPE}</div>
            </div>
        </div>
        <div className='content-line'></div>   
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>두께(mm)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.THICK}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>장축(mm)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.LENG_LONG}</div>
            </div>
        </div>        
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>단축(mm)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{item.LENG_SHORT}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>표시(앞)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{item.PRINT_FRONT}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>표시(뒤)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{item.PRINT_BACK}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>약학정보원<br />이미지생성일</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.IMG_REGIST_TS}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>제형코드이름</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.FORM_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크내용(앞)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.MARK_CODE_FRONT_ANAL !== null && item.MARK_CODE_FRONT_ANAL !== "" ? item.MARK_CODE_FRONT_ANAL : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크내용(뒤)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.MARK_CODE_BACK_ANAL !== null && item.MARK_CODE_BACK_ANAL !== "" ? item.MARK_CODE_BACK_ANAL : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크이미지(앞)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.MARK_CODE_FRONT_IMG !== null && item.MARK_CODE_FRONT_IMG !== "" ? item.MARK_CODE_FRONT_IMG : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크이미지(뒤)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.MARK_CODE_BACK_IMG !== null && item.MARK_CODE_BACK_IMG !== "" ? item.MARK_CODE_BACK_IMG : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>변경일자</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.CHANGE_DATE}</div>
            </div>
        </div>
        <div className='content-line'></div>
            </div>
                ))}
                </div>
                    </div>}
                {toggleState === 4 && <div className="content active-content">
                <div className='accordion'>
                {accordion.map((item, i) => (
                <div className='accordion-item' key={i}>
                    <div className='accordion-title' onClick={() => toggle(i)}>
                    {item.question}
                    <span>{selected === i ? '-' : '+'}</span>
                </div>
            <div className={selected === i ? 'accordion-content show' : 'accordion-content'}>
            {selected === i && item.answer}
          </div>
        </div>
      ))}
    </div>
        </div>}
            {toggleState === 5 && <div className="content active-content">
                <div className='review-height-container'>
                <div className='medicine-detail-tabs-box'>
                    <div className='review-main-box'>
                        <div className='review-top-box'>
                            <div className='review-box'>
                                <div className='button' onClick={onShowReviewClickHandler}>
                                    {
                                        showReview ? <div className='review-button-click'>리뷰 작성하기</div> : <div className='review-button'>리뷰 작성하기</div>
                                    }
                                    </div>
                                        </div>
                                    </div>
                                    {
                                        showReview &&
                                        <div className='showreview'>
                                            <div className='rating-gap'>
                                            <Rating
                                            count={5}
                                            value={starRating} 
                                            onChange={(value) => setStarRating(value)}
                                            /> 
                                        <div className='rating-number'>{starRating}</div>
                                        </div>
                                        <div className='review-input-box'>
                                            <div className='review-input-container'>
                                                <div className='board-write-content-box'>
                                                    <textarea className='review-textarea' placeholder='리뷰를 작성해보세요.' onChange={onReviewChangeHandler} ref={reviewRef} value={review}/>
                                                    <div className='icon camera-icon' onClick={onImageUploadButtonClickHandler}></div>
                                                    <input ref={imageInputRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={onImageChangeHandler}/>
                                                    </div>
                                                </div>
                                                <div className='board-write-images-box'>
                                                    {imageUrls.map((imageUrl, index) => 
                                                        <div className='review-write-image-box'>
                                                        <img className='board-write-image' src={imageUrl}/>
                                                        <div className='image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                                        <div className='icon close-icon'></div>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                                <div className='review-button-box'>
                                                <div className={review === '' ? 'disable-button' : 'brown-button'} onClick={onReviewSubmitButtonClickHandler}>{'작성하기'}</div>
                                            </div>
                                        </div>   
                                    </div> 
                                    }
                            <div className='review-content-number-box'>
                                <div className='review-number'>리뷰
                                    <div className='review-number-number'>{`${totalReviewCount}`}</div>
                                </div>
                            </div>
                                <Pagination
                                    render={() => (
                                    ReviewList.slice((currentPage-1)*6, currentPage*6).map((reviewListItem, index) => (
                                    <ReviewItem key={index} reviewListItem={reviewListItem} onSuccessUpdate={refreshReviews}/>
                                    ))
                                    )}
                                    onPageChange={handlePageChange}
                                    currentPage={currentPage} 
                                    totalPages={Math.ceil(totalReviewCount / 6)}
                                    />
                            </div>
                        </div>
                        </div>
                    </div>}
              </div>
          </div>
      </div>
  );
}
