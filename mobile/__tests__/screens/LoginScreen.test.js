import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import { Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

// Mock du hook useAuth
jest.mock('../../src/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock de Alert pour spy
jest.spyOn(Alert, 'alert');

describe('LoginScreen Component', () => {
    const mockSignIn = jest.fn();
    const mockNavigation = { navigate: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup state du contexte mocké
        useAuth.mockReturnValue({
            signIn: mockSignIn,
            isLoading: false,
        });
    });

    it('affiche correctement le formulaire', () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Mot de passe')).toBeTruthy();
        expect(getByText('Se connecter')).toBeTruthy();
    });

    it('affiche une erreur si on ne remplit pas les champs', () => {
        const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
        
        fireEvent.press(getByText('Se connecter'));
        
        expect(Alert.alert).toHaveBeenCalledWith('Erreur', 'Veuillez remplir tous les champs.');
        expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('appelle signIn lorsque les champs sont remplis', async () => {
        const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);
        
        fireEvent.changeText(getByPlaceholderText('Email'), 'test@plume.test');
        fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password123');
        fireEvent.press(getByText('Se connecter'));
        
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@plume.test', 'password123');
        });
    });

    it('navigue vers la création de compte', () => {
        const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
        
        fireEvent.press(getByText('Créer un compte'));
        
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
    });
});
