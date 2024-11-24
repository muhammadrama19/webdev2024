import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActorCard from './actorCard'; // Adjust the path as needed

describe('ActorCard Component', () => {
  it('renders the ActorCard component with props', () => {
    const props = {
      imageSrc: 'actor.jpg',
      name: 'John Doe',
      role: 'Main Actor',
    };

    render(<ActorCard {...props} />);

   
    const image = screen.getByAltText(props.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', props.imageSrc);

   
    const name = screen.getByText(props.name);
    expect(name).toBeInTheDocument();

   
    const role = screen.getByText(props.role);
    expect(role).toBeInTheDocument();
  });

  it('renders the fallback image when imageSrc is "N/A"', () => {
    const props = {
      imageSrc: 'N/A',
      name: 'Jane Doe',
      role: 'Supporting Actor',
    };

    render(<ActorCard {...props} />);

    
    const image = screen.getByAltText(props.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://avatar.iran.liara.run/public/38');


    const name = screen.getByText(props.name);
    expect(name).toBeInTheDocument();

 
    const role = screen.getByText(props.role);
    expect(role).toBeInTheDocument();
  });

  it('renders the ActorCard component with default props', () => {
    render(<ActorCard />);

   
    const image = screen.getByAltText('No Name');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://avatar.iran.liara.run/public/38');


    const name = screen.getByText('No Name');
    expect(name).toBeInTheDocument();

 
    const role = screen.getByText('No Role');
    expect(role).toBeInTheDocument();
  });
});