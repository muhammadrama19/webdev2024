import React from 'react';
import { Pagination } from 'react-bootstrap';
import './pagination.scss';

const PaginationCustom = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of pages to show in the pagination

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than maxVisiblePages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first and last page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (startPage > 2) {
        pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <Pagination className="custom-pagination">
      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

      {generatePageNumbers().map((page, index) => (
        <Pagination.Item
          key={index}
          active={page === currentPage}
          disabled={page === '...'}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    </Pagination>
  );
};

export default PaginationCustom;
