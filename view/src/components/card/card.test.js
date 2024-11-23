import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Card from './card';

describe('Card Component', () => {
    const onClickMock = jest.fn();
    const props = {
        onClick: onClickMock,
        src: 'https://via.placeholder.com/150',
        title: 'Test Title',
        year: '2021',
        genres: 'Action, Adventure',
        rating: 4.5,
        views: 1000,
    };

    test('renders the Card component with props', () => {
        render(<Card {...props} />);
        expect(screen.getByText(props.title)).toBeInTheDocument();
        expect(screen.getByText(props.year)).toBeInTheDocument();
        expect(screen.getByText(props.genres)).toBeInTheDocument();
        expect(screen.getByText(`Rate ${props.rating}/5`)).toBeInTheDocument();
        expect(screen.getByText(`${props.views} views`)).toBeInTheDocument();
        const image = screen.getByAltText(props.title);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', props.src);
    });

    test('calls onClick when the card is clicked', () => {
        render(<Card {...props} />);
        fireEvent.click(screen.getByRole('img', { name: props.title }));
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when the card is not clicked', () => {
        render(<Card {...props} />);
        expect(onClickMock).not.toHaveBeenCalled();
    });

    test('renders the Card component with no props', () => {
        render(<Card />);
        expect(screen.getByText('No Title Available')).toBeInTheDocument();
        expect(screen.getByText('Unknown Year')).toBeInTheDocument();
        expect(screen.getByText('Unknown Genres')).toBeInTheDocument();
        expect(screen.getByText('Rate N/A/5')).toBeInTheDocument();
        expect(screen.getByText('0 views')).toBeInTheDocument();
        const image = screen.getByAltText('No Title');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://via.placeholder.com/196x294?text=No+Image+Available');
    });
});
