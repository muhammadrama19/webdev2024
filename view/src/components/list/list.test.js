// List.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import List from './list';


const mockMoviesData = [
  {
    id: 1,
    title: "Test Movie 1",
    background: "test-image-1.jpg",
    imdb_score: "8.5",
    synopsis: "Test synopsis 1"
  },
  {
    id: 2,
    title: "Test Movie 2",
    background: "test-image-2.jpg",
    imdb_score: "7.9",
    synopsis: "Test synopsis 2"
  }
];

jest.mock('react-slick', () => {
  return function MockSlider({ children, nextArrow, prevArrow }) {
    return (
      <div data-testid="mock-slider">
        <div data-testid="prev-arrow-container">{prevArrow}</div>
        {children}
        <div data-testid="next-arrow-container">{nextArrow}</div>
      </div>
    );
  };
});

jest.mock('@mui/icons-material/ArrowBackIos', () => {
  return function MockArrowBackIos() {
    return <span>←</span>;
  };
});

jest.mock('@mui/icons-material/ArrowForwardIos', () => {
  return function MockArrowForwardIos() {
    return <span>→</span>;
  };
});

// Mock ListItem component
jest.mock('../listitem/listitem', () => {
  return function MockListItem({ imageUrl, rating, title, description }) {
    return (
      <div data-testid="mock-list-item">
        <p>{title}</p>
        <p>{description}</p>
        <p>{rating}</p>
        <img src={imageUrl} alt={title} />
      </div>
    );
  };
});

describe('List Component', () => {

  beforeAll(() => {
    global.fetch = jest.fn();
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    );

    render(<List />);
    expect(screen.getByText('No movies available')).toBeInTheDocument();
  });

  it('renders movies after successful API call', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockMoviesData)
      })
    );

    render(<List />);

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8001/top-rated');
  });

  it('handles API error gracefully', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API Error'))
    );

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<List />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(screen.getByText('No movies available')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('renders ListItem components with correct props', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockMoviesData)
      })
    );

    render(<List />);

    await waitFor(() => {
      mockMoviesData.forEach(movie => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
        expect(screen.getByText(movie.synopsis)).toBeInTheDocument();
        expect(screen.getByText(movie.imdb_score)).toBeInTheDocument();
      });
    });
  });

  it('handles missing data with placeholder content', async () => {
    const incompleteMovie = [{
      id: 1,

    }];

    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve(incompleteMovie)
      })
    );

    render(<List />);

    await waitFor(() => {
      expect(screen.getByText('No Title Available')).toBeInTheDocument();
      expect(screen.getByText('No Description Available')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByAltText('No Title Available')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/196x294?text=No+Image+Available'
      );
    });
  });

  it('renders Slider component with navigation arrows', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockMoviesData)
      })
    );

    render(<List />);
    

    expect(screen.getByTestId('mock-slider')).toBeInTheDocument();
    expect(screen.getByTestId('prev-arrow-container')).toBeInTheDocument();
    expect(screen.getByTestId('next-arrow-container')).toBeInTheDocument();

    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('does not make multiple API calls on re-render', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve(mockMoviesData)
      })
    );

    const { rerender } = render(<List />);

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });

    rerender(<List />);
    
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('handles empty API response', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve([])
      })
    );

    render(<List />);

    await waitFor(() => {
      expect(screen.getByText('No movies available')).toBeInTheDocument();
    });
  });
});