import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface AmlPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount?: number;
}

const AmlPagination: React.FC<AmlPaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalCount = 0,
}) => {
  const handlePageClick = (page: number) => {
    if (page === currentPage) return;
    onPageChange(page);
  };

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
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      );
      pageNumbers.push(renderPageNumber(totalPages));
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(renderPageNumber(1));
      pageNumbers.push(
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      );
      for (let i = totalPages - 4; i <= totalPages; i += 1) {
        pageNumbers.push(renderPageNumber(i));
      }
    } else {
      pageNumbers.push(renderPageNumber(1));
      pageNumbers.push(
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      );
      for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
        pageNumbers.push(renderPageNumber(i));
      }
      pageNumbers.push(
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      );
      pageNumbers.push(renderPageNumber(totalPages));
    }

    return pageNumbers;
  };

  return (
    <Pagination className='justify-between mt-2'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            onClick={() => handlePageClick(currentPage - 1)}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage === totalPages}
            onClick={() => handlePageClick(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
      <div className='flex flex-col items-center gap-2 mt-3'>
        <span className='text-sm'>{totalCount} items</span>
      </div>
    </Pagination>
  );
};

export default AmlPagination;
