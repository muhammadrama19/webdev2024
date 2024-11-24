import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewInput from './reviewInput';
import '@testing-library/jest-dom';

const MockStarIcon = ({ className, onClick }) => (
  <button 
    data-testid="star-icon" 
    className={className} 
    onClick={onClick}
  >
    star
  </button>
);

jest.mock('@mui/icons-material/Star', () => ({
  __esModule: true,
  default: (props) => <MockStarIcon {...props} />
}));

jest.mock('@mui/icons-material/FavoriteBorder', () => () => <div data-testid="favorite-border-icon" />);
jest.mock('@mui/icons-material/Favorite', () => () => <div data-testid="favorite-icon" />);
jest.mock('@mui/icons-material/Close', () => () => <div data-testid="close-icon" />);
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({})
}));

describe('ReviewInput Component', () => {
  const mockProps = {
    movieImage: 'test-image.jpg',
    title: 'Test Movie',
    movieId: 1,
    userId: 1,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  it('renders with initial state', () => {
    render(<ReviewInput {...mockProps} />);
    
    expect(screen.getByAltText('Movie Poster')).toBeInTheDocument();
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a review...')).toBeInTheDocument();
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
    expect(screen.getByTestId('favorite-border-icon')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('handles rating selection', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    
    render(<ReviewInput {...mockProps} />);
    
    const stars = screen.getAllByTestId('star-icon');
    fireEvent.click(stars[2]); 
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8001/add-reviews',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movie_id: 1,
            user_id: 1,
            content: '',
            rating: 3,
            status: 0
          })
        }
      );
    });
  });

  it('handles successful submission', async () => {

    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    const Swal = require('sweetalert2');
    
    render(<ReviewInput {...mockProps} />);
    
    
    const textarea = screen.getByPlaceholderText('Add a review...');
    fireEvent.change(textarea, { target: { value: 'Test review' } });
    

    const stars = screen.getAllByTestId('star-icon');
    fireEvent.click(stars[4]); // 5 stars
    
  
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8001/add-reviews',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movie_id: 1,
            user_id: 1,
            content: 'Test review',
            rating: 5,
            status: 0
          })
        }
      );
    });

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Review added!',
        text: 'Your review has been added. It will be published after approval.'
      });
    });

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('handles failed submission', async () => {

    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: false
      })
    );

    const Swal = require('sweetalert2');
    
    render(<ReviewInput {...mockProps} />);
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Failed to save review',
        text: 'An error occurred while saving your review. Please try again later.'
      });
    });
    
    expect(mockProps.onClose).not.toHaveBeenCalled();
  });

  it('handles network error', async () => {

    global.fetch = jest.fn(() => 
      Promise.reject(new Error('Network error'))
    );

    const Swal = require('sweetalert2');
    
    render(<ReviewInput {...mockProps} />);
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Failed to save review s',
        text: 'An error occurred while saving your review. Please try again later.'
      });
    });
  });

  it('handles like toggle', () => {
    render(<ReviewInput {...mockProps} />);
    
    const likeButton = screen.getByTestId('favorite-border-icon').parentElement;
    fireEvent.click(likeButton);
    
    expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
    
    fireEvent.click(likeButton);
    expect(screen.getByTestId('favorite-border-icon')).toBeInTheDocument();
  });

  it('handles close button click', () => {
    render(<ReviewInput {...mockProps} />);
    
    const closeButton = screen.getByTestId('close-icon').closest('button');
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});