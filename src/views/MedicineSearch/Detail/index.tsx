import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import './style.css'
import { MedicineListItem,  ReviewListItem, Medicine, FavoriteMedicine, Medicinepermission } from 'types/interface';
import { MedicineInfo } from 'types/interface';
import { GetReviewListRequest, postReviewRequest, fileuploadRequest, getMedicineRequest, getMedicinePermissionRequest, getFavoriteMedicineRequest, putFavoriteMedicineRequest, getMedicineInfoRequest } from 'apis'
import { ResponseDto } from 'apis/response';
import { GetFavoriteMedicineResponseDto, GetReviewListResponseDto, PutFavoriteMedicineResponseDto } from 'apis/response/review';
import ReviewItem from 'components/ReviewItem';
import Pagination from 'components/Pagination/Pagination';
import { useLoginUserStore, useReviewStore } from 'stores';
import { useCookies } from 'react-cookie';
import { PostReviewResponseDto } from 'apis/response/review';
import { PostReviewRequestDto } from 'apis/request/review';
import { GetMedicineInfoResponseDto, GetMedicinePermissionResponseDto, GetMedicineResponeDto } from "apis/response/medicine";
import Rating from "components/Rating/Rating";
import { Myalert } from 'components/alert';

export default function MedicineDetail() {
  const [toggleState, setToggleState] = useState(1);
  const { ITEM_SEQ } = useParams();
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  const [medicine, setMedicine] = useState<Medicine>({} as Medicine);
  const [medicinepermission, setMedicinepermission] = useState<Medicinepermission>({} as Medicinepermission);
  const [medicineinfo, setMedicineinfo] = useState<MedicineInfo>({} as MedicineInfo);
  const [totalCount, setTotalCount] = useState(0);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [favoriteListItems, setFavoriteListItems] = useState<FavoriteMedicine[]>([]);
  const { loginUser } = useLoginUserStore();

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
  //쿠키 상태
  const[cookies, setCookies] = useCookies();
  //이미지 입력 요소 참조 상태
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  //게시물 이미지 미리보기 URL 상태
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  //게시물 이미지 리스트
  const { reviewImageFileList, setReviewImageFileList } = useReviewStore();

  const toggleTab = (index: number) => {
      setToggleState(index);
  };

  //아코디언 toggle
  const [selected, setSelected] = useState<number | null>(null);

  const toggle = (i: number) => {
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

useEffect(() => {
    getMedicineRequest(ITEM_SEQ ?? '').then(getMedicineResponse);
    getMedicinePermissionRequest(ITEM_SEQ ?? '').then(getMedicinePermissionResponse);
    getMedicineInfoRequest(ITEM_SEQ ?? '').then(getMedicineInfoResponse);
  }, [ITEM_SEQ]);

//의약품 정보
const getMedicineResponse = (responseBody: GetMedicineResponeDto | ResponseDto | null) => {
    const medicine: Medicine = {...responseBody as GetMedicineResponeDto};
    setMedicine(medicine);
    console.log(medicine);
}

//의약품 제품 허가 정보
const getMedicinePermissionResponse = (responseBody: GetMedicinePermissionResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'NP') return
    const medicinepermission: Medicinepermission = {...responseBody as GetMedicinePermissionResponseDto};
    setMedicinepermission(medicinepermission);
    console.log(medicinepermission);
}

//의약품 복약 정보
const getMedicineInfoResponse = (responseBody: GetMedicineInfoResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'NP') return
    const medicineinfo: MedicineInfo = {...responseBody as GetMedicineInfoResponseDto};
    setMedicineinfo(medicineinfo);
    console.log(medicineinfo);
}

//리뷰 글 불러오기(Get)
const getReviewListResponse = (responseBody: GetReviewListResponseDto | ResponseDto | null) => {
    if (!responseBody) {
        setReviewList([]);
        setTotalReviewCount(0);
        return;
    }
    const { code } = responseBody;
    if(code === 'NR') {
        setReviewList([]);
        setTotalReviewCount(0);
    }
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
    console.log(code);
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

  //관심 의약품(GET)
  const getFavoriteMedicineResponse = (responseBody: GetFavoriteMedicineResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'DBE') {
      alert('데이터베이스 오류입니다.');
      return;
    }
    if (code !== 'SU') return;
  
    const { favoriteListItems } = responseBody as GetFavoriteMedicineResponseDto;
    setFavoriteListItems(favoriteListItems);
    console.log(favoriteListItems);

    // const isFavorite = favoriteListItems.findIndex(favorite => favorite.userId === loginUser?.userId, favorite.itemSeq ==) !== -1;
    
    const favoriteItem = favoriteListItems.find(favorite =>
        favorite.userId === loginUser?.userId && favorite.itemSeq === ITEM_SEQ
      );
      console.log("favoriteItem:", favoriteItem);
      
      const isFavorite = favoriteItem !== undefined;
      setFavorite(isFavorite);
      console.log("isFavorite:", isFavorite);
  };
  

//관심 의약품 저장
const putFavoriteMedicineResponse = (responseBody: PutFavoriteMedicineResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;

    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code === 'NU') 
        Myalert("warning", "로그인 안내", "로그인이 필요한 서비스입니다.", "확인")
    if (code !== 'SU') return;

    if (!ITEM_SEQ) return;

    if (!loginUser || !cookies.accessToken) {
        Myalert("warning", "로그인 안내", "로그인이 필요한 서비스입니다.", "확인")
        return; 
    }
    getFavoriteMedicineRequest(cookies.accessToken).then(getFavoriteMedicineResponse);
    getMedicineRequest(ITEM_SEQ).then(getMedicineResponse);
};

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
    if (!loginUser || !cookies.accessToken) {
        Myalert("warning", "로그인 안내", "로그인이 필요한 서비스입니다.", "확인")
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
        Myalert("success", "리뷰 작성 완료", "리뷰 작성에 성공했습니다!", "확인")
      postReviewRequest(ITEM_SEQ, requestBody, accessToken).then(postReviewResponse);
    }
  }
  
  //관심 의약품 버튼 클릭 이벤트 처리
  const onPutFavoriteMedicineClickHandler = () => {
    const accessToken = cookies.accessToken;
    console.log("관심 의약품 버튼 클릭");
    const requestBody = {
        item_NAME: medicine.item_NAME ?? "",
        form_CODE_NAME: medicine.form_CODE_NAME ?? "",
        class_NAME: medicine.class_NAME ?? "",
        entp_NAME: medicine.entp_NAME ?? "",
        etc_OTC_NAME: medicine.etc_OTC_NAME ?? "",
        class_NO: medicine.class_NO ?? "",
        item_IMAGE: medicine.item_IMAGE ?? "",
        item_ENG_NAME: medicine.item_ENG_NAME ?? ""
    };
    console.log("관심 의약품:", requestBody);

    if (accessToken && ITEM_SEQ) {
        putFavoriteMedicineRequest(ITEM_SEQ, requestBody, accessToken).then(putFavoriteMedicineResponse);
    } else {
        console.error("ITEM_SEQ가 유효하지 않습니다.");
        Myalert("warning", "로그인 안내", "로그인이 필요한 서비스입니다.", "확인")
    }
};

useEffect(() => {
    getFavoriteMedicineRequest(cookies.accessToken).then(getFavoriteMedicineResponse);
}, [cookies.accessToken]);


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
    if (!ITEM_SEQ) return;
    GetReviewListRequest(ITEM_SEQ).then(getReviewListResponse);
};

const accordion = [
    {
        question: '효능',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-box'>
                    <div className='accordion-content-text'>
                        {medicineinfo.efcy_Qesitm}
                    </div>
                </div>
            </div>
        ),
    },
    {
        question: '사용법',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-box'>
                    <div className='accordion-content-text'>
                    {medicineinfo.use_Method_Qesitm}
                    </div>
                </div>
            </div>
        ),
    },
    {
        question: '주의사항',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-title-box'>
                    <div className='accordion-content-titel-text'>주의사항 경고<br/></div>
                    <div className='accordion-content-text'>
                    {medicineinfo.atpn_Warn_Qesitm}
                    </div>
                    <div className='accordion-content-titel-text'>주의사항<br/></div>
                    <div className='accordion-content-text'>
                    {medicineinfo.atpn_Qesitm}
                    </div>
                </div>
            </div>
        ),
    },
    {
        question: '상호작용',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-box'>
                    <div className='accordion-content-text'>    
                    {medicineinfo.intrc_Qesitm}
                    </div>
                </div>
            </div>
        ),
    },
    {
        question: '부작용',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-box'>
                    <div className='accordion-content-text'> 
                        {medicineinfo.se_Qesitm}
                    </div>
                </div>
            </div>
        ),
    },
    {
        question: '보관법',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-box'>
                    <div className='accordion-content-text'> 
                    {medicineinfo.deposit_Method_Qesitm}
                    </div>
                </div>
            </div>
        ),
    },
    {
        question: '수정일자, 공개일자',
        answer: (
            <div>
                <div className='medicine-detail-basics-content-title-box'>
                    <div className='accordion-content-titel-text'>공개일자<br/></div>
                        <div className='accordion-content-text'>
                        {medicineinfo.open_De}<br/>
                        </div>
                        <div className='accordion-content-titel-text'>
                            수정일자<br/>
                        </div>
                        <div className='accordion-content-text'>     
                        {medicineinfo.update_De}
                    </div>    
                </div>
            </div>
        ),
    }
  ]

  return (
      <div id='medicine-detail'>
          <div className='medicine-detail-container'>
            <div className='medicine-detail-content-box'>
                <div className='medicine-detail-image' style={{ backgroundImage: `url(${medicine.item_IMAGE})` }}></div>
                    <div className='medicine-detail-text-container'>
                    <div className='medicine-detail-content-etc'>{medicine.etc_OTC_NAME}</div>
                    <div className='medicine-detail-content-name'>{medicine.item_NAME}</div>
                    <div className='medicine-detail-content-eng-name'>{medicine.item_ENG_NAME}</div>
                    <div className='favorite-button' onClick={onPutFavoriteMedicineClickHandler}>
                        {favorite ?
                            <div className='favorite-full'></div> :
                            <div className='favorite-empty'></div>
                        }
                        </div>
                      </div>
                    </div>
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
            <div className='medicine-detail-basics-content-box-main'>
            <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title-top'>성분명</div>
            <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content'>{medicinepermission.main_ITEM_INGR !== null && medicinepermission.main_ITEM_INGR !== "" ? medicinepermission.main_ITEM_INGR : "-"}</div>
        <div className='medicine-detail-basics-content-eng'>{medicinepermission.main_INGR_ENG}</div>
    </div>
</div>
    <div className='content-line-top'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>분류</div>
            <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-two'>[{medicine.class_NO}] {medicine.class_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>구분</div>
            <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-two'>{medicine.etc_OTC_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>제형</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{medicine.form_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
    <div className='medicine-detail-basics-content-box'>
        <div className='medicine-detail-basics-title'>판매사명</div>
            <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content-four'>
            {medicine.entp_NAME} {medicinepermission.entp_ENG_NAME}
        </div>
    </div>
</div>
<div className='content-line'></div>
     </div>
    </div>
        </div>}
        {/* 전문가정보 tab */}
            {toggleState === 2 && <div className="content active-content">
            <div className='medicine-detail-tabs-box'>
                <div className='medicine-detail-basics-content-box-main'>
                    <div className='medicine-detail-basics-content-box'>
                        <div className='medicine-detail-basics-title-top'>허가일</div>
                        <div className='medicine-detail-text-container'>
                        <div className='medicine-detail-basics-content-top'>{medicinepermission.item_PERMIT_DATE}</div>
                    </div>
                </div>
            <div className='content-line-top'></div> 
                <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>표준코드</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicinepermission.bar_CODE}</div>
            </div>
        </div>
</div>
        <div className='content-line'></div>
            <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>성상</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicinepermission.chart}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>품목일련번호</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicinepermission.item_SEQ}</div>
            </div>
        </div>
        <div className='content-line'></div>
<div className='medicine-detail-basics-content-box'>
    <div className='medicine-detail-basics-title'>ATC코드</div>
                <div className='medicine-detail-text-container'>
            <div className='medicine-detail-basics-content'>{medicinepermission.atc_CODE !== null && medicinepermission.atc_CODE !== "" ? medicinepermission.atc_CODE : "-"}</div>
        </div>
</div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>주성분</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicinepermission.main_ITEM_INGR}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>보험코드</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicinepermission.edi_CODE !== null && medicinepermission.edi_CODE !== "" ? medicinepermission.edi_CODE : "-"}</div>
                
            </div>
        </div>
        <div className='content-line'></div>
                </div>
            </div>
}
                  {toggleState === 3 && <div className="content active-content">
                  <div className='medicine-detail-tabs-box-info'>
                    <div className='medicine-detail-basics-content-box-main'>
                        <div className='medicine-detail-basics-content-box'>
                        <div className='medicine-detail-basics-title-top'>성상</div>
                        <div className='medicine-detail-text-container'>
                        <div className='medicine-detail-basics-content-info'>{medicine.chart}</div>    
                    </div>
                </div>
            <div className='content-line-top'></div> 
            <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>의약품모양</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicine.drug_SHAPE}</div>
            </div>
        </div>
        <div className='content-line'></div>   
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>두께(mm)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicine.thick}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>장축(mm)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicine.leng_LONG}</div>
            </div>
        </div>        
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>단축(mm)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'>{medicine.leng_SHORT}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>표시(앞)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{medicine.print_FRONT}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>표시(뒤)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-two'>{medicine.print_BACK}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>약학정보원<br />이미지생성일</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.img_REGIST_TS}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>제형코드이름</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.form_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크내용(앞)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.mark_CODE_FRONT_ANAL !== null && medicine.mark_CODE_FRONT_ANAL !== "" ? medicine.mark_CODE_FRONT_ANAL : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크내용(뒤)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.mark_CODE_BACK_ANAL !== null && medicine.mark_CODE_BACK_ANAL !== "" ? medicine.mark_CODE_BACK_ANAL : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크이미지(앞)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.mark_CODE_FRONT_IMG !== null && medicine.mark_CODE_FRONT_IMG !== "" ? medicine.mark_CODE_FRONT_IMG : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>마크이미지(뒤)</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.mark_CODE_BACK_IMG !== null && medicine.mark_CODE_BACK_IMG !== "" ? medicine.mark_CODE_BACK_IMG : "-"}</div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
            <div className='medicine-detail-basics-title'>변경일자</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{medicine.change_DATE}</div>
            </div>
        </div>
        <div className='content-line'></div>
            </div>
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
                                                <div className='write-images-box'>
                                                    {imageUrls.map((imageUrl, index) => 
                                                        <div className='review-write-image-box'>
                                                        <img className='write-image' src={imageUrl}/>
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
                                    totalReviewCount > 0 ? ( 
                                    ReviewList.slice((currentPage-1)*6, currentPage*6).map((reviewListItem, index) => (
                                    <ReviewItem key={index} reviewListItem={reviewListItem} onSuccessUpdate={refreshReviews}/>
                                    ))
                                ):(
                                    <div className='review-empty'>해당 의약품 리뷰가 없습니다.</div>
                                )
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