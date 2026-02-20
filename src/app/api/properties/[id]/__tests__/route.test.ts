/**
 * @jest-environment node
 */
import { properties } from '@/data/mock';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => data,
      headers: new Map([['content-type', 'application/json']]),
    }),
  },
}));

describe('GET /api/properties/[id]', () => {
  const mockRequest = { url: 'http://localhost:3000/api/properties/prop-1' };

  beforeEach(() => {
    jest.resetModules();
  });

  describe('Successful Requests', () => {
    it('should return property when valid ID is provided', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'prop-1' } });
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toBeDefined();
      expect(data.id).toBe('prop-1');
    });

    it('should return property with correct structure', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'prop-1' } });
      const data = await response.json();
      
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('address');
      expect(data).toHaveProperty('price');
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('listedDate');
      expect(data).toHaveProperty('imageUrl');
    });

    it('should return correct property for different IDs', async () => {
      const { GET } = await import('../route');
      const firstProperty = properties[0];
      const response = await GET(mockRequest as any, { params: { id: firstProperty?.id || '' } });
      const data = await response.json();
      
      expect(data.id).toBe(firstProperty?.id);
      expect(data.address).toBe(firstProperty?.address);
    });

    it('should handle multiple sequential requests', async () => {
      const { GET } = await import('../route');
      const response1 = await GET(mockRequest as any, { params: { id: 'prop-1' } });
      const data1 = await response1.json();
      
      const response2 = await GET(mockRequest as any, { params: { id: 'prop-2' } });
      const data2 = await response2.json();
      
      expect(data1.id).toBe('prop-1');
      expect(data2.id).toBe('prop-2');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 when property ID does not exist', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'non-existent-id' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Not found');
    });

    it('should return 404 for empty ID', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: '' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
    });

    it('should return 404 for invalid ID format', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: '123-invalid' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
    });

    it('should handle special characters in ID', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'prop-@#$%' } });
      const data = await response.json();
      
      expect(response.status).toBe(404);
    });
  });

  describe('Response Format', () => {
    it('should return object with json method', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'prop-1' } });
      
      expect(typeof response.json).toBe('function');
    });

    it('should have content-type header', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'prop-1' } });
      
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return valid JSON for success', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'prop-1' } });
      const data = await response.json();
      
      expect(typeof data).toBe('object');
      expect(data).not.toBeNull();
    });

    it('should return valid JSON for error', async () => {
      const { GET } = await import('../route');
      const response = await GET(mockRequest as any, { params: { id: 'invalid' } });
      const data = await response.json();
      
      expect(typeof data).toBe('object');
      expect(data).not.toBeNull();
      expect(data.error).toBeDefined();
    });
  });

  describe('All Property IDs', () => {
    it('should successfully return each property in mock data', async () => {
      const { GET } = await import('../route');
      for (const property of properties) {
        const response = await GET(mockRequest as any, { params: { id: property.id } });
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.id).toBe(property.id);
        expect(data.address).toBe(property.address);
        expect(data.price).toBe(property.price);
      }
    });
  });
});
