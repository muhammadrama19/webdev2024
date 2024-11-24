import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MovieReview from './movieReview';
import UserReview from '../userReview/userReview';

jest.mock('react-bootstrap', () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  Row: ({ children }) => <div className="row">{children}</div>,
  Col: ({ children, xs, md }) => <div className="col">{children}</div>,
  Container: ({ children }) => <div className="container">{children}</div>,
}));


jest.mock('../userReview/userReview', () => {
  return jest.fn(({ userName, userImage, rating, reviewText, createdAt }) => (
    <div data-testid="user-review">
      <div data-testid="user-name">Review by {userName}</div>
      <img src={userImage} alt={userName} />
      <div data-testid="rating">{'⭐'.repeat(rating)}</div>
      <div data-testid="review-text">{reviewText}</div>
      <div data-testid="created-at">{createdAt}</div>
    </div>
  ));
});

jest.mock('../../assets/Oval.svg', () => 'mock-image-path');

describe('MovieReview Component', () => {
  const mockReviews = [
    {
      review_id: 1,
      user_name: 'John Doe',
      user_picture: 'https://example.com/user1.jpg',
      rating: 4,
      content: 'Great movie! Really enjoyed it.',
      created_at: '2024-11-24T12:00:00Z'
    },
    {
      review_id: 2,
      user_name: 'Jane Smith',
      user_picture: null,
      rating: 5,
      content: 'Excellent performance by the cast.',
      created_at: '2024-11-23T12:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('shows loading state initially', () => {
    global.fetch.mockImplementationOnce(() => 
      new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<MovieReview id="123" />);
    expect(screen.getByText('Loading reviews...')).toBeInTheDocument();
  });

  it('displays reviews when data is loaded successfully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReviews)
      })
    );

    render(<MovieReview id="123" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading reviews...')).not.toBeInTheDocument();
    });

   
    expect(UserReview).toHaveBeenCalledTimes(2);
    expect(UserReview).toHaveBeenCalledWith(
      expect.objectContaining({
        userName: 'John Doe',
        userImage: 'https://example.com/user1.jpg',
        rating: 4,
        reviewText: 'Great movie! Really enjoyed it.',
        createdAt: expect.any(String)
      }),
      expect.anything()
    );
  });

  it('displays fallback image when user_picture is null', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([mockReviews[1]])
      })
    );

    render(<MovieReview id="123" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading reviews...')).not.toBeInTheDocument();
    });

    expect(UserReview).toHaveBeenCalledWith(
      expect.objectContaining({
        userImage: 'mock-image-path', // Should use fallback image
        userName: 'Jane Smith'
      }),
      expect.anything()
    );
  });

  it('displays "No reviews available" when no reviews are returned', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    );

    render(<MovieReview id="123" />);

    await waitFor(() => {
      expect(screen.getByText('No reviews available.')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<MovieReview id="123" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading reviews...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No reviews available.')).toBeInTheDocument();
    // Verify error was logged
    expect(console.error).toHaveBeenCalled;
  });

  it('refetches reviews when id prop changes', async () => {
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReviews)
      })
    );

    const { rerender } = render(<MovieReview id="123" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8001/movies/detail/review/123'
      );
    });

    rerender(<MovieReview id="456" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8001/movies/detail/review/456'
      );
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});