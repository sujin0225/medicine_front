import './style.css'
import { useEffect, useState } from 'react';
import { MedicineListItem } from 'types/interface';
import MedicineItem from 'components/MedicineItem/MedicineItem';
import Pagination from 'components/Pagination/Pagination';
import Search from 'components/Search/Search';
import { GetMedicineListResponseDto } from 'apis/response/medicine';
import { ResponseDto } from 'apis/response';
import { getMedicineListRequest } from 'apis';

export default function MedicineSearch() {
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 

  useEffect(() => {
    getMedicineListRequest(0).then(getMedicineListResponse);
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 페이지 번호 변경
    getMedicineListRequest(page).then(getMedicineListResponse); // 변경된 페이지 번호로 데이터 다시 가져오기
  };

  //의약품 리스트 가져오기(GET)
  const getMedicineListResponse = (responseBody: GetMedicineListResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') {
      alert('데이터베이스 오류입니다.');
      return;
    }
    if (code !== 'SU') return;

    const { medicineListItems } = responseBody as GetMedicineListResponseDto;
    const { totalCount } = responseBody as GetMedicineListResponseDto;
    setMedicineList(medicineListItems);
    setTotalCount(totalCount); 
    console.log(medicineListItems);
    console.log(totalCount);
  }

  return (
    <>
    {/* 이미지부분 */}
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
      {/* 검색창 */}
      <Search />
      {/* 의약품 카드부분 */}
      <div id='medicine-search'>
        <div className='medicine-search-container'>
        <Pagination
          render={() => (
            <div id='medicine-search'>
              <div className='medicine-search-container'>
                {/* {medicineList.map((medicineListItem, index) => (
                  <MedicineItem key={index} medicineListItem={medicineListItem} />
                ))} */}
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
