import axios from 'axios';

jest.mock('axios', () => {
    const mAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        defaults: { baseURL: 'http://localhost:8000' },
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() },
        },
    };
    return {
        create: jest.fn(() => mAxiosInstance),
    };
});

import api from '../src/services/api';

describe('API Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('doit être défini', () => {
        expect(api).toBeDefined();
    });

    it('doit posséder une baseURL', () => {
        expect(api.defaults.baseURL).toBeDefined();
    });

    it('doit appeler get correctement', async () => {
        api.get.mockResolvedValueOnce({ data: { success: true } });
        const res = await api.get('/test');
        expect(api.get).toHaveBeenCalledWith('/test');
        expect(res.data.success).toBe(true);
    });
});
