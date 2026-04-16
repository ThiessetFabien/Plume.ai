import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import api from '../../src/services/api';

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// On mock api pour ce test
jest.mock('../../src/services/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("doit s'initialiser sans utilisateur si aucun token n'est stocké", async () => {
        getItemAsync.mockResolvedValueOnce(null);

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.userToken).toBeNull();
        expect(result.current.user).toBeNull();
    });

    it('doit récupérer le profil asynchrone si un token existe', async () => {
        getItemAsync.mockResolvedValueOnce('fake-token');
        api.get.mockResolvedValueOnce({ data: { id: 1, full_name: 'Lucas' } });

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(api.get).toHaveBeenCalledWith('/players/me', {
            headers: { Authorization: `Bearer fake-token` }
        });
        expect(result.current.userToken).toBe('fake-token');
        expect(result.current.user.full_name).toBe('Lucas');
    });

    it('signIn doit mettre à jour le state et enregistrer le token', async () => {
        // Mock init sans token
        getItemAsync.mockResolvedValueOnce(null);
        
        // Mock signIn API responses
        api.post.mockResolvedValueOnce({ data: { access_token: 'new-token' } });
        api.get.mockResolvedValueOnce({ data: { id: 2, full_name: 'TestUser' } });

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
        
        // Attendre la fin du checkToken
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Effectuer un Login
        await act(async () => {
            await result.current.signIn('test@test.com', 'password');
        });

        expect(api.post).toHaveBeenCalledWith('/token', expect.any(Object), expect.any(Object));
        expect(setItemAsync).toHaveBeenCalledWith('userToken', 'new-token');
        expect(result.current.userToken).toBe('new-token');
        expect(result.current.user.full_name).toBe('TestUser');
    });

    it('signOut doit supprimer le token et nettoyer le state', async () => {
        // Init avec token
        getItemAsync.mockResolvedValueOnce('token-to-delete');
        api.get.mockResolvedValueOnce({ data: { id: 3, full_name: 'DeleteMe' } });

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await waitFor(() => {
            expect(result.current.userToken).toBe('token-to-delete');
        });

        // Déconnexion
        await act(async () => {
            await result.current.signOut();
        });

        expect(deleteItemAsync).toHaveBeenCalledWith('userToken');
        expect(result.current.userToken).toBeNull();
        expect(result.current.user).toBeNull();
    });
});
