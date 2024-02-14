import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../MedicineSearch/style.css';
import Search from 'components/Search/Search';
import Pagination from 'components/Pagination/Pagination';
import { MedicineListItem } from 'types/interface';
import MedicineItem from 'components/MedicineItem/MedicineItem';
import { medicineSearch } from 'publicapi';

export default function SearchView() {

  //state: searchWord path variable
  const { searchWord } = useParams();
  //state: 검색 게시물 개수 상태
  const [count, setCount] = useState<number>(0);
  //state: 의약품 리스트 상태
  const [medicineList, setMedicineList] = useState<MedicineListItem[]>([]);
  //state: 페이지 변경 상태
  const [currentPage, setCurrentPage] = useState(1);
  //state: 전체 페이지 상태
  const [totalCount, setTotalCount] = useState(0);
  //state: 검색어 상태
  const [word, setWord] = useState<string>('');
  //state: 검색 버튼 상태
  const [status, setStatus] = useState<boolean>(false);
  
  useEffect(() => {
    fetchData(searchWord ?? ''); // searchWord가 undefined일 경우 ''으로 대체
}, [searchWord]);

  const fetchData = async (searchWord: string) => {
    try {
      const data = await medicineSearch(searchWord); 
      setMedicineList(data.body.items); 
      setTotalCount(data.body.totalCount); 
      console.log("검색 리스트 불러오기:", data.body.items); 
    } catch (error) {
      console.error('데이터 불러오기 에러:', error);
    }
  };
  
  const handlePageChange = (newPageNo: number) => {
    setCurrentPage(newPageNo); // 페이지 번호 변경
    // fetchData(newPageNo); // 변경된 페이지 번호로 데이터 다시 가져오기
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
