import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListItem from './listitem'; 

describe('ListItem Component', () => {
  it('renders the ListItem component with props', () => {
    const props = {
      imageUrl: 'poster.jpg',
      title: 'Movie 1',
      rating: '4.5',
      description: 'This is a great movie!',
    };

    render(<ListItem {...props} />);
    const image = screen.getByAltText(props.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', props.imageUrl);

    const title = screen.getByText(props.title);
    expect(title).toBeInTheDocument();

   
    const rating = screen.getByText(props.rating);
    expect(rating).toBeInTheDocument();

    
    const description = screen.getByText(props.description);
    expect(description).toBeInTheDocument();

    const moreIcon = screen.getByTestId('MoreVertIcon');
    expect(moreIcon).toBeInTheDocument();

   
    const playIcon = screen.getByTestId('PlayCircleOutlineIcon');
    expect(playIcon).toBeInTheDocument();
  });

  it('renders the ListItem component with default props', () => {
    render(<ListItem />);

   
    const image = screen.getByAltText('No Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/150');

   
    const title = screen.getByText('No Title');
    expect(title).toBeInTheDocument();

    
    const rating = screen.getByText('N/A');
    expect(rating).toBeInTheDocument();

   
    const description = screen.getByText('No Description Available');
    expect(description).toBeInTheDocument();

    
    const moreIcon = screen.getByTestId('MoreVertIcon');
    expect(moreIcon).toBeInTheDocument();

    
    const playIcon = screen.getByTestId('PlayCircleOutlineIcon');
    expect(playIcon).toBeInTheDocument();
  });
});