
import { render, screen, fireEvent } from '@testing-library/react';
import UserReview from './userReview';

describe('UserReview Component', () => {
  const mockProps = {
    userName: 'John Doe',
    userImage: 'https://example.com/user.jpg',
    rating: 4,
    reviewText: 'This is a detailed review that is long enough to require truncation when displayed.This is a detailed review that is long enough to require truncation when displayed.This is a detailed review that is long enough to require truncation when displayed.This is a detailed review that is long enough to require truncation when displayed.',
    createdAt: '2024-11-24',
  };

  it('renders the component with provided props', () => {
    render(<UserReview {...mockProps} />);
    expect(screen.getByText(`Review by ${mockProps.userName}`)).toBeInTheDocument();
    expect(screen.getByText('⭐⭐⭐⭐')).toBeInTheDocument();
    expect(screen.getByText(mockProps.createdAt)).toBeInTheDocument();
    expect(screen.getByAltText(mockProps.userName)).toHaveAttribute('src', mockProps.userImage);
    // Use a more flexible text matcher
    expect(screen.getByText((content) => content.includes('This is a detailed review'))).toBeInTheDocument();
  });

  it('truncates long text by default', () => {
    render(<UserReview {...mockProps} />);
    const truncatedText = `${mockProps.reviewText.substring(0, 150)}...`;
    expect(screen.getByText((content) => content.includes(truncatedText))).toBeInTheDocument();
    expect(screen.queryByText(mockProps.reviewText, { exact: true })).not.toBeInTheDocument();
  });

  it('expands and collapses the review text when "See more" and "See less" are clicked', () => {
    render(<UserReview {...mockProps} />);

    
    const seeMoreButton = screen.getByRole('button', { name: /see more/i });
    expect(seeMoreButton).toBeInTheDocument();

    fireEvent.click(seeMoreButton);
    expect(screen.getByText((content) => content === mockProps.reviewText)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /see more/i })).not.toBeInTheDocument();

    // Click "See less" and verify the text is truncated again
    const seeLessButton = screen.getByRole('button', { name: /see less/i });
    fireEvent.click(seeLessButton);
    const truncatedText = `${mockProps.reviewText.substring(0, 150)}...`;
    expect(screen.getByText((content) => content.includes(truncatedText))).toBeInTheDocument();
    expect(screen.queryByText(mockProps.reviewText, { exact: true })).not.toBeInTheDocument();
  });

  it('handles short review text without truncation', () => {
    const shortReviewProps = { ...mockProps, reviewText: 'Short review' };
    render(<UserReview {...shortReviewProps} />);
    expect(screen.getByText('Short review')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /see more/i })).not.toBeInTheDocument();
  });
});