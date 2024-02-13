import './style.css'
import { medicine } from 'publicapi';
import { useEffect } from 'react';
import { MedicineListItem } from 'types/interface';
import MedicineItem from 'components/MedicineItem/MedicineItem';
import { useState } from 'react'

export default function MedicineSearch() {
  
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);

  useEffect(() => {
    // medicine 함수를 호출하여 데이터를 가져오고 상태를 업데이트합니다.
    const fetchData = async () => {
      try {
        const data = await medicine(); // medicine 함수를 호출하여 데이터 가져오기
        // medicine 함수에서 가져온 데이터를 상태에 저장합니다.
        setMedicineList(data.body.items);
        console.log("Medicine List:", data.body.items); // 데이터 확인용 로그
      } catch (error) {
        console.error('Failed to fetch medicine data:', error);
      }
    };

    fetchData();
  }, []);

  const MedicineSearchTop = () => {
    return (
      <div className='medicine-search-background'>
        <div id='medicine-search'>
          <div className='medicine-search-background-container'>
            <div className='medicine-search-text-box'>
              <div className='medicine-search-text-title'>의약품</div>
              <div className='medicine-search-text-title-bold'>검색</div>
            </div>
            <div className='medicine-search-text-content'>식품의약품안전처 제공 데이터를 사용합니다.</div>
          </div>
        </div>
      </div>
    )
  }
  
  const MedicineSearchBottom = () => {
    return (
      <div id='medicine-search'>
        <div className='medicine-search-container'>
          {medicineList.map((medicineListItem, index) => (
            <MedicineItem key={index} medicineListItem={medicineListItem} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <MedicineSearchTop />
      <MedicineSearchBottom />
    </>
  )
}
