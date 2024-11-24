import CoverDetail from "./coverDetail";
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('CoverDetail Component', () => {

    test('should render with props', () => {

        const props ={
            srcBackgroung: 'background.jpg',
        }
        render(<CoverDetail {...props} />);
        const background = screen.getByAltText('background');
    })

    test('should render without props', () => {
        render(<CoverDetail />);
        const background = screen.getByAltText('background');
    })

    test('should the default image if not given', () => {
        render(<CoverDetail />);
        const background = screen.getByAltText('background');
        expect(background).toHaveAttribute('src', 'https://via.assets.so/img.jpg?w=1024&h=307&tc=WHITE&bg=&t=no background available');
    });
        


    
    
});