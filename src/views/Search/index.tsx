import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../MedicineSearch/Main/style.css';
import Search from 'components/Search/Search';
import Pagination from 'components/Pagination/Pagination';
import { MedicineListItem } from 'types/interface';
import MedicineItem from 'components/MedicineItem/MedicineItem';
import { GetMedicineListResponseDto } from 'apis/response/medicine';
import { ResponseDto } from 'apis/response';
import { getSearchMedicineListRequest } from 'apis';

export default function SearchView() {
  //state: 의약품 리스트 상태
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  //state: 페이지 변경 상태
  const [currentPage, setCurrentPage] = useState(1);
  //state: 전체 페이지 상태
  const [totalCount, setTotalCount] = useState(0);
  const { searchWord } = useParams<{ searchWord: string }>();

  // 페이지나 검색어가 변경될 때마다 데이터를 가져오는 useEffect
  useEffect(() => {
    if (searchWord) {
      getSearchMedicineListRequest(searchWord, currentPage-1).then(getSearchMedicineListResponse);
    }
  }, [searchWord, currentPage]);

    //의약품 리스트 가져오기(GET)
    const getSearchMedicineListResponse = (responseBody: GetMedicineListResponseDto | ResponseDto | null) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  
  if(!searchWord) return(<></>);
  return (
    <>
    {/* 이미지부분 */}
    <div className='medicine-search-background'>
        <div id='medicine-search'>
          <div className='medicine-search-background-container'>
            <div className='medicine-search-text-box'>
              <div className='medicine-search-text-title'>{'의약품'}</div>
              <div className='medicine-search-text-title-bold'>{'검색'}</div>
            </div>
            <div className='medicine-search-text-content'>{'식품의약품안전처 제공 데이터를 사용합니다.'}</div>
          </div>
        </div>
      </div>
      {/* 검색창 */}
      <Search />
      <div id='medicine-search'>
        <div className='medicine-search-background-container'>
          {/* 검색어 */}
          <div className='search-box'>
          <div className='search-title-name'>{searchWord}</div>
            <div className='search-title'>{'에 대한'}</div>
            <div className='search-title-name'>{totalCount}</div>
            <div className='search-title'>{'개의 검색결과 입니다.'}</div>
          </div>
          {totalCount === 0 ?
        <div className='search-contents-nothing'>{'검색 결과가 없습니다.'}</div> :
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
        }
        </div>
      </div>
    </>
  )
}
