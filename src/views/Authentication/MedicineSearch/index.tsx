import './style.css'
import { medicine } from 'publicapi';
import { useEffect, useState } from 'react';
import { MedicineListItem } from 'types/interface';
import MedicineItem from 'components/MedicineItem/MedicineItem';
import Pagination from 'components/Pagination/Pagination';

export default function MedicineSearch() {
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 

  useEffect(() => {
    fetchData(1); 
  }, []); 

  const fetchData = async (pageNo: number) => {
    try {
      const data = await medicine(pageNo); 
      setMedicineList(data.body.items); 
      setTotalCount(data.body.totalCount); 
      console.log("Medicine List:", data.body.items); 
    } catch (error) {
      console.error('데이터 불러오기 에러:', error);
    }
  };

  const handlePageChange = (newPageNo: number) => {
    setCurrentPage(newPageNo); // 페이지 번호 변경
    fetchData(newPageNo); // 변경된 페이지 번호로 데이터 다시 가져오기
  };

  return (
    <>
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
      <div id='medicine-search'>
        <div className='medicine-search-container'>
        <Pagination
          render={() => (
            <div id='medicine-search'>
              <div className='medicine-search-container'>
                {medicineList.map((medicineListItem, index) => (
                  <MedicineItem key={index} medicineListItem={medicineListItem} />
                ))}
              </div>
            </div>
          )}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / 16)} 
        />
        </div>
        
      </div>
    </>
  );
}  
