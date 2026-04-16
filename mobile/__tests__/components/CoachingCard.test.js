import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CoachingCard from '../../src/components/CoachingCard';

describe('CoachingCard Component', () => {
    it('affiche le loader quand isLoading est vrai', () => {
        const { getByText } = render(<CoachingCard isLoading={true} />);
        expect(getByText('Le coach Plume analyse tes performances...')).toBeTruthy();
    });

    it("ne rend rien si aucun message n'est fourni et non loading", () => {
        const { toJSON } = render(<CoachingCard isLoading={false} message="" />);
        expect(toJSON()).toBeNull();
    });

    it('affiche le message et gère la fermeture', () => {
        const mockOnClose = jest.fn();
        const { getByText, getByTestId } = render(
            <CoachingCard isLoading={false} message="Test de conseil IA" onClose={mockOnClose} />
        );

        expect(getByText('Test de conseil IA')).toBeTruthy();
        expect(getByText('Conseil Copilote')).toBeTruthy();

        fireEvent.press(getByTestId('close-button'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
