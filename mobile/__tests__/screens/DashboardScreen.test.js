import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../../src/screens/DashboardScreen';
import api from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';

// Mocks complets pour isoler le composant Dashboard
jest.mock('../../src/services/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

jest.mock('../../src/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({ navigate: mockNavigate }),
    // On ne déclenche PAS le callback pour éviter une boucle infinie de re-renders
    useFocusEffect: jest.fn(),
}));

// Mock du chart pour éviter les erreurs Canvas
jest.mock('react-native-chart-kit', () => ({
    LineChart: () => null,
}));

// Mock de l'AttendanceChart car il use le chart-kit
jest.mock('../../src/components/AttendanceChart', () => () => null);

describe('DashboardScreen Component', () => {
    const mockSignOut = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ signOut: mockSignOut });
    });

    it('affiche une erreur si le fetch de /players/me échoue', async () => {
        api.get.mockRejectedValueOnce(new Error('Network Error'));

        const { getByText } = render(<DashboardScreen />);

        await waitFor(() => {
            expect(getByText('Oups !')).toBeTruthy();
        });
        expect(getByText('Network Error')).toBeTruthy();
    });

    it('récupère et affiche les données du joueur avec succès', async () => {
        api.get
            .mockResolvedValueOnce({ data: { id: 1, full_name: 'Fabien Thiesset' } })
            .mockResolvedValueOnce({ data: { total_attendances: 15, attendance_rate: 85 } });

        const { getByText } = render(<DashboardScreen />);

        await waitFor(() => {
            expect(getByText('Salut, Fabien ! 👋')).toBeTruthy();
        });
        expect(getByText('85%')).toBeTruthy();
        expect(getByText('15')).toBeTruthy();
    });

    it('appelle signOut quand on clique sur le bouton de déconnexion', async () => {
        api.get
            .mockResolvedValueOnce({ data: { id: 1, full_name: 'Fabien' } })
            .mockResolvedValueOnce({ data: { total_attendances: 10, attendance_rate: 75 } });

        const { getByTestId } = render(<DashboardScreen />);

        await waitFor(() => {
            expect(getByTestId('logout-button')).toBeTruthy();
        });

        const { fireEvent } = require('@testing-library/react-native');
        fireEvent.press(getByTestId('logout-button'));
        expect(mockSignOut).toHaveBeenCalled();
    });
});
