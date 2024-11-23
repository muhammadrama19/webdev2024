import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Featured from './featured'; // Adjust the path as needed

// Mocking the Button component
jest.mock('../button/button', () => ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
));

// Mocking global fetch for the movie data
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        id: 1,
        background: 'background.jpg',
        poster: 'poster.jpg',
        title: 'Featured Movie',
        synopsis: 'This is a great movie!',
      },
      {
        id: 2,
        background: 'background2.jpg',
        poster: 'poster2.jpg',
        title: 'Another Movie',
        synopsis: 'This is another great movie!',
      },
    ]),
  })
);

describe('Featured Component', () => {
  it('renders the component and displays the first movie', async () => {
    // Render the component inside Router (necessary for useNavigate)
    const { container } = render(
      <Router>
        <Featured />
      </Router>
    );

    // Wait for the movies data to be fetched and rendered
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Wait for the first movie title to appear
    const movieTitle = await screen.findByText((content, element) => {
      return element.textContent.includes('Featured Movie');
    });
    const moviePoster = await screen.findByAltText('Featured Movie');

    expect(movieTitle).toBeInTheDocument();
    expect(moviePoster).toBeInTheDocument();

    // Find an element by class
    const movieContainer = container.querySelector('.featured-container');
    expect(movieContainer).toBeInTheDocument();

    // Create a snapshot of the rendered component
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should display loading message while data is being fetched', () => {
    // Render the component before the async fetch is resolved
    render(
      <Router>
        <Featured />
      </Router>
    );

    // Check if the loading message is displayed initially
    const loadingMessage = screen.getByText('Loading...');
    expect(loadingMessage).toBeInTheDocument();
  });
});