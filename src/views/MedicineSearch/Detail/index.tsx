import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './style.css'
import { medicineDetail } from 'publicapi';
import { MedicineListItem } from 'types/interface';

export default function MedicineDetail() {
  const [toggleState, setToggleState] = useState(1);
  const { ITEM_SEQ, ITEM_NAME } = useParams();
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const toggleTab = (index: number) => {
      setToggleState(index);
  };

  useEffect(() => {
      fetchData(ITEM_SEQ ?? ''); // searchWord가 undefined일 경우 ''으로 대체
  }, [ITEM_SEQ]);

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
                        <div className='medicine-detail-basics-content-box' key={index}>
                            <div className='medicine-detail-basics-title-top'>품목명</div>
                            <div className='medicine-detail-text-container'>
                        <div className='medicine-detail-basics-content-top'>{item.ITEM_NAME}</div>
                    <div className='medicine-detail-basics-content-eng'>{item.ITEM_ENG_NAME}</div>
                </div>
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
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>보험적용</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.FORM_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>보험적용</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.FORM_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>투여경로</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.FORM_CODE_NAME}</div>
            </div>
        </div>
        <div className='content-line'></div> 
        <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>판매사명</div>
                <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content-four'>{item.ENTP_NAME}</div>
            </div>
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
                <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>표준코드(대표)</div>
                    <div className='medicine-detail-text-container'>
                {/* <div className='medicine-detail-basics-content'>[{item.CLASS_NO}] {item.CLASS_NAME}</div> */}
            </div>
        </div>
        <div className='content-line'></div> 
            <div className='medicine-detail-basics-content-box'>
                <div className='medicine-detail-basics-title'>표준코드(일반)</div>
                    <div className='medicine-detail-text-container'>
                {/* <div className='medicine-detail-basics-content'>[{item.CLASS_NO}] {item.CLASS_NAME}</div> */}
            </div>
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
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'></div>
            </div>
        </div>
        <div className='content-line'></div>
        <div className='medicine-detail-basics-content-box'>
                    <div className='medicine-detail-basics-title'>주성분코드</div>
                    <div className='medicine-detail-text-container'>
                <div className='medicine-detail-basics-content'></div>
            </div>
        </div>
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
                  {toggleState === 4 && <div className="content active-content">4</div>}
                  {toggleState === 5 && <div className="content active-content">5</div>}
              </div>
              
          </div>
      </div>
  );
}
