import Error403 from './error403'; 
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Error403 Component', () => {
    it('should render the error page', async () => {
        render(<Error403 />, { wrapper: MemoryRouter });
    
        await waitFor(() => {
        expect(screen.getByText(/403/)).toBeInTheDocument();
        expect(screen.getByText(/Not this time, access forbidden!/)).toBeInTheDocument();
        });
    });

    it('should render the error page with the correct class name', async () => {
        render(<Error403 />, { wrapper: MemoryRouter });
    
        await waitFor(() => {
        expect(screen.getByText(/403/).className).toBe('errorCode');
        expect(screen.getByText(/Not this time, access forbidden!/).className).toBe('infoError');
        });
    });
});