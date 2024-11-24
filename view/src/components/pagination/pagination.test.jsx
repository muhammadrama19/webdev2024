
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationCustom from './pagination';


jest.mock('react-bootstrap', () => ({
  Pagination: {
    ...jest.requireActual('react-bootstrap').Pagination,
    Item: ({ children, active, disabled, onClick }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`page-item ${active ? 'active' : ''}`}
        data-testid="pagination-item"
      >
        {children}
      </button>
    ),
    Prev: ({ onClick, disabled }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className="page-prev"
        data-testid="pagination-prev"
      >
        Previous
      </button>
    ),
    Next: ({ onClick, disabled }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className="page-next"
        data-testid="pagination-next"
      >
        Next
      </button>
    ),
  }
}));

describe('PaginationCustom Component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination with correct number of pages when total pages <= 5', () => {
    render(
      <PaginationCustom
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    expect(pageItems).toHaveLength(5);
    expect(pageItems.map(item => item.textContent)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('renders truncated pagination when total pages > 5', () => {
    render(
      <PaginationCustom
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    // Should show: 1 ... 3 4 5 6 7 ... 10
    expect(pageItems.map(item => item.textContent)).toEqual(['1', '...', '3', '4', '5', '6', '7', '...', '10']);
  });

  it('disables Previous button on first page', () => {
    render(
      <PaginationCustom
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByTestId('pagination-prev');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <PaginationCustom
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByTestId('pagination-next');
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with correct page number when clicking page number', () => {
    render(
      <PaginationCustom
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    fireEvent.click(pageItems[2]); // Click on page 3
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with correct page when clicking Next', () => {
    render(
      <PaginationCustom
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByTestId('pagination-next');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with correct page when clicking Previous', () => {
    render(
      <PaginationCustom
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByTestId('pagination-prev');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('does not call onPageChange when clicking ellipsis', () => {
    render(
      <PaginationCustom
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    const ellipsisButton = pageItems.find(item => item.textContent === '...');
    fireEvent.click(ellipsisButton);
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('shows correct range of pages when on first page of many', () => {
    render(
      <PaginationCustom
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
   
    expect(pageItems.map(item => item.textContent)).toEqual(['1', '2', '3', '...', '10']);
  });

  it('shows correct range of pages when on last page of many', () => {
    render(
      <PaginationCustom
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    expect(pageItems.map(item => item.textContent)).toEqual(['1', "...", '8', '9', '10']);
  });

  it('marks current page as active', () => {
    render(
      <PaginationCustom
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    expect(pageItems[2]).toHaveClass('active'); // Page 3 should be active
  });

  it('does not call onPageChange when clicking current page', () => {
    render(
      <PaginationCustom
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pageItems = screen.getAllByTestId('pagination-item');
    fireEvent.click(pageItems[2]); // Click on current page (3)
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});