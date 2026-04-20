import React from 'react';
import { render } from '@testing-library/react-native';
import StatCard from '../../src/components/StatCard';
import { View } from 'react-native';

const MockIcon = () => <View testID="stat-icon" />;

describe('StatCard Component', () => {
    it('affiche le label et la valeur correctement', () => {
        const { getByText, getByTestId } = render(
            <StatCard 
                label="Sessions" 
                value="42" 
                icon={MockIcon} 
                color="#ff0000" 
            />
        );

        expect(getByText('Sessions')).toBeTruthy();
        expect(getByText('42')).toBeTruthy();
        expect(getByTestId('stat-icon')).toBeTruthy();
    });
});
