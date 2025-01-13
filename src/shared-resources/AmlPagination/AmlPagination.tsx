import React, { useCallback, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';

interface AmlPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  totalCount: number;
}

const AmlPagination: React.FC<AmlPaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  disabled,
  totalCount = 0,
}) => {
  const handlePageClick = useCallback(
    (page: number) => {
      if (page === currentPage) return;
      onPageChange(page);
    },
    [currentPage, onPageChange]
  );

  const renderPageNumber = (page: number): React.JSX.Element => (
    <PaginationLink
      isActive={currentPage === page}
      key={page}
      onClick={() => handlePageClick(page)}
    >
      {page}
    </PaginationLink>
  );

  const renderPageNumbers = (): React.JSX.Element[] => {
    const pageNumbers: React.JSX.Element[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pageNumbers.push(renderPageNumber(i));
      }
    } else if (currentPage <= 4) {
      for (let i = 1; i <= 5; i += 1) {
        pageNumbers.push(renderPageNumber(i));
      }
      pageNumbers.push(
        <PaginationItem key='ellipsis-1'>
          <PaginationEllipsis />
        </PaginationItem>
      );
      pageNumbers.push(renderPageNumber(totalPages));
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(renderPageNumber(1));
      pageNumbers.push(
        <PaginationItem key='ellipsis-2'>
          <PaginationEllipsis />
        </PaginationItem>
      );
      for (let i = totalPages - 4; i <= totalPages; i += 1) {
        pageNumbers.push(renderPageNumber(i));
      }
    } else {
      pageNumbers.push(renderPageNumber(1));
      pageNumbers.push(
        <PaginationItem key='ellipsis-3'>
          <PaginationEllipsis />
        </PaginationItem>
      );
      for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
        pageNumbers.push(renderPageNumber(i));
      }
      pageNumbers.push(
        <PaginationItem key='ellipsis-4'>
          <PaginationEllipsis />
        </PaginationItem>
      );
      pageNumbers.push(renderPageNumber(totalPages));
    }

    return pageNumbers;
  };

  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      handlePageClick(1);
    }
  }, [currentPage, handlePageClick, totalPages]);

  return (
    <Pagination className='justify-between items-center mt-2'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={disabled || currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            disabled={disabled || currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
      <p className='text-sm text-primary'>{totalCount} items</p>
    </Pagination>
  );
};

export default AmlPagination;
