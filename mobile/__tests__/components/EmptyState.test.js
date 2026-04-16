import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { View } from 'react-native';

// Composant icône factice pour les tests
const MockIcon = () => <View testID="mock-icon" />;

describe('EmptyState Component', () => {
    it('affiche le titre et la description', () => {
        const { getByText, getByTestId } = render(
            <EmptyState 
                icon={MockIcon} 
                title="Titre de test" 
                description="Description de test" 
            />
        );

        expect(getByText('Titre de test')).toBeTruthy();
        expect(getByText('Description de test')).toBeTruthy();
        expect(getByTestId('mock-icon')).toBeTruthy();
    });

    it("n'affiche pas de bouton si onAction n'est pas fourni", () => {
        const { queryByText } = render(
            <EmptyState 
                icon={MockIcon} 
                title="Sans bouton" 
                description="Ce composant n'a pas d'action" 
                actionLabel="Cliquez-moi" 
            />
        );

        expect(queryByText('Cliquez-moi')).toBeNull();
    });

    it("affiche le bouton et appelle la fonction au clic", () => {
        const mockOnAction = jest.fn();
        const { getByText } = render(
            <EmptyState 
                icon={MockIcon} 
                title="Avec bouton" 
                description="Ce composant a une action" 
                actionLabel="Valider" 
                onAction={mockOnAction}
            />
        );

        const button = getByText('Valider');
        expect(button).toBeTruthy();

        fireEvent.press(button);
        expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
});
