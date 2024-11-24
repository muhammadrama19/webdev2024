import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActorSlider from './actorSlider';


jest.mock('react-slick', () => {
  return function MockSlider({ children, nextArrow, prevArrow }) {
    return (
      <div data-testid="mock-slider">
        <div data-testid="prev-arrow-container">{prevArrow}</div>
        <div data-testid="slider-content">{children}</div>
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

jest.mock('../actorcard/actorCard', () => {
  return function MockActorCard({ imageSrc, name, role }) {
    return (
      <div data-testid="actor-card">
        <img src={imageSrc} alt={name} data-testid="actor-image" />
        <h6>{name}</h6>
        <p>{role}</p>
      </div>
    );
  };
});

describe('ActorSlider Component', () => {
  const mockActors = [
    {
      id: 108,
      name: "Blake Lively",
      role: "Lily Bloom",
      actor_picture: "https://image.tmdb.org/t/p/w500/rkGVjd6wImtgjOCi0IpeffdEWtb.jpg"
    },
    {
      id: 109,
      name: "Justin Baldoni",
      role: "Ryle Kincaid",
      actor_picture: "https://image.tmdb.org/t/p/w500/2sc6iUWljADnqtjsaKU3s6f0DGW.jpg"
    }
  ];

 
  it('renders actor cards when actors are provided', () => {
    render(<ActorSlider actors={mockActors} title="Cast" />);

  
    expect(screen.getByTestId('mock-slider')).toBeInTheDocument();

   
    expect(screen.getByText('Cast')).toBeInTheDocument();

    
    mockActors.forEach(actor => {
      expect(screen.getByText(actor.name)).toBeInTheDocument();
      expect(screen.getByText(actor.role)).toBeInTheDocument();
    });
  });

  
  it('displays "No actors available" when actors array is empty', () => {
    render(<ActorSlider actors={[]} />);
    expect(screen.getByText('No actors available')).toBeInTheDocument();
  });

  
  it('renders navigation arrows', () => {
    render(<ActorSlider actors={mockActors} />);
    expect(screen.getByText('←')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  
  it('passes correct props to ActorCard components', () => {
    render(<ActorSlider actors={mockActors} />);
    
    const actorImages = screen.getAllByTestId('actor-image');
    expect(actorImages).toHaveLength(mockActors.length);
    
    actorImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockActors[index].actor_picture);
      expect(img).toHaveAttribute('alt', mockActors[index].name);
    });
  });

  
  it('handles actors with missing data', () => {
    const incompleteActors = [
      { id: 1 }, 
      { id: 2, name: "John Doe" },
    ];

    render(<ActorSlider actors={incompleteActors} />);


    expect(screen.getAllByText('No Name')).toHaveLength(1);
    expect(screen.getAllByText('No Role')).toHaveLength(2);
  });

  it('contains correct slider settings', () => {
    const { container } = render(<ActorSlider actors={mockActors} />);
    

    expect(container.getElementsByClassName('wrapperList')).toHaveLength(1);
    

    expect(container.getElementsByClassName('lists')).toHaveLength(1);
  });

  it('renders without title when not provided', () => {
    const { container } = render(<ActorSlider actors={mockActors} />);
    const headers = container.querySelectorAll('h2');
    expect(headers).toHaveLength(0);
  });

 
  it('handles null actors prop gracefully', () => {
    render(<ActorSlider actors={null} />);
    expect(screen.getByText('No actors available')).toBeInTheDocument();
  });
});