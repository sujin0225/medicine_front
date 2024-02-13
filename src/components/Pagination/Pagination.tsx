import React from 'react';
import './Pagination.css';

interface PaginationProps {
  render: () => React.ReactNode; // 아이템들을 렌더링하는 함수
  onPageChange: (newPageNo: number) => void; // 페이지 변경 콜백 함수
  currentPage: number; // 현재 페이지 번호
  totalPages: number; // 전체 페이지 수
}

const Pagination: React.FC<PaginationProps> = ({
  render,
  onPageChange,
  currentPage,
  totalPages
}) => {
  const pagesToShow = 5; 

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <div
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-number ${currentPage === i ? 'active' : 'public-number'}`}
        >
          {i}
        </div>
      );
    }

    return pages;
  };

  return (
    <div>
      {render()}
      <div id='pagination'>
      <div className="pagination-container">
        <div
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        >
          <div className='left-page'></div>
        </div>
        {renderPageNumbers()}
        <div
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        >
        <div className='right-page'></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Pagination;
