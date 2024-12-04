import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import Featured from './featured';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('react-bootstrap', () => ({
  Row: ({ children }) => <div data-testid="row">{children}</div>,
  Col: ({ children }) => <div data-testid="col">{children}</div>
}));

const mockMovies = [
  {
    id: 1,
    title: "Test Movie 1",
    background: "background1.jpg",
    poster: "poster1.jpg",
    synopsis: "Test synopsis 1",
    imdb_score: 8.5
  },
  {
    id: 2,
    title: "Test Movie 2",
    background: "background2.jpg",
    poster: "poster2.jpg",
    synopsis: "Test synopsis 2",
    imdb_score: 8.3
  }
];

global.fetch = jest.fn();
global.Image = class {
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 100);
  }
};

describe('Featured Component', () => {
  let navigateMock;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockMovies)
    });

    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders loading state initially', () => {
    render(<Featured />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('fetches and displays movie data correctly', async () => {
    render(<Featured />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockMovies[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockMovies[0].synopsis)).toBeInTheDocument();
    
    const backgroundImage = screen.getAllByAltText(mockMovies[0].title)[0];
    expect(backgroundImage).toHaveAttribute('src', mockMovies[0].background);
    
    const posterImage = screen.getAllByAltText(mockMovies[0].title)[1];
    expect(posterImage).toHaveAttribute('src', mockMovies[0].poster);
  });

  test('handles API error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(<Featured />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('navigates to movie details when See More button is clicked', async () => {
    render(<Featured />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const seeMoreButton = screen.getByText('See More');
    userEvent.click(seeMoreButton);

    expect(navigateMock).toHaveBeenCalledWith(`/movies/${mockMovies[0].id}`);
  });

  test('cycles through movies automatically', async () => {
    render(<Featured />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(mockMovies[0].title)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText(mockMovies[1].title)).toBeInTheDocument();
    });
  });
});