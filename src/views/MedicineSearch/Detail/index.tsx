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
                  {toggleState === 1 && <div className="content active-content">
                    <div className='medicine-detail-tabs-box'>
                      <div className='medicine-detail-basics'>성분명</div>
                    </div>
                    </div>}
                  {toggleState === 2 && <div className="content active-content">2</div>}
                  {toggleState === 3 && <div className="content active-content">3</div>}
                  {toggleState === 4 && <div className="content active-content">4</div>}
                  {toggleState === 5 && <div className="content active-content">5</div>}
              </div>
          </div>
      </div>
  );
}
